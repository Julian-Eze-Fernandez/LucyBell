using AutoMapper;
using AutoMapper.QueryableExtensions;
using LucyBell.Server.DTOs.AdministracionesUsuarioDTOs;
using LucyBell.Server.Services;
using LucyBell.Server.Utilidades;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/usuarios")]
	public class UsuariosController : ControllerBase
	{
		private readonly UserManager<IdentityUser> userManager;
		private readonly IConfiguration configuration;
		private readonly SignInManager<IdentityUser> signInManager;
		private readonly ApplicationDbContext context;
		private readonly IMapper mapper;
		private readonly IEmailService emailService;

		public UsuariosController(UserManager<IdentityUser> userManager,
			IConfiguration configuration,
			SignInManager<IdentityUser> signInManager,
			ApplicationDbContext context,
			IMapper mapper,
			IEmailService emailService)
		{
			this.userManager = userManager;
			this.configuration = configuration;
			this.signInManager = signInManager;
			this.context = context;
			this.mapper = mapper;
			this.emailService = emailService;
		}

		[HttpGet("ListadoUsuarios")]
		public async Task<ActionResult<List<UsuarioDTO>>> ListadoUsuarios([FromQuery] PaginacionDTO paginacionDTO)
		{
			var queryable = context.Users.AsQueryable();
			await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
			var usuarios = await queryable.ProjectTo<UsuarioDTO>(mapper.ConfigurationProvider)
				.OrderBy(x => x.Email).Paginar(paginacionDTO).ToListAsync();

			return usuarios;
		}

        [HttpGet("CantidadUsuarios")]
        public async Task<ActionResult<int>> ObtenerCantidadUsuarios()
        {
            var cantidadUsuarios = await context.Users.CountAsync();
            return Ok(cantidadUsuarios);
        }

        [HttpGet("me")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<UsuarioDTO>> ObtenerUsuarioActual()
        {
            // Obtener el ID del usuario desde los claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("No se pudo identificar al usuario.");
            }

            // Buscar al usuario en la base de datos
            var usuario = await userManager.FindByIdAsync(userId);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            // Mapear al DTO
            var usuarioDTO = mapper.Map<UsuarioDTO>(usuario);

            return Ok(usuarioDTO);
        }

		[HttpPost("registrar")]
		public async Task<ActionResult<RespuestaAutenticacionDTO>> Registrar(CredencialesUsuarioCreacionDTO credencialesUsuarioCreacionDTO)
		{
			var usuario = new IdentityUser
			{
				UserName = credencialesUsuarioCreacionDTO.Nombre,
				Email = credencialesUsuarioCreacionDTO.Email,
				PhoneNumber = credencialesUsuarioCreacionDTO.Telefono
			};

			var resultado = await userManager.CreateAsync(usuario, credencialesUsuarioCreacionDTO.Password);

			if (resultado.Succeeded)
			{
				var token = await userManager.GenerateEmailConfirmationTokenAsync(usuario);
				var callbackUrl = Url.Action(
					nameof(ConfirmarEmail),
					"Usuarios",
					new { userId = usuario.Id, token },
					protocol: HttpContext.Request.Scheme);


				var emailBody = $"<p>Por favor confirme su cuenta haciendo clic en este enlace: <a href='{callbackUrl}'>Confirmar cuenta</a></p>";
				await emailService.SendEmailAsync(credencialesUsuarioCreacionDTO.Email, "Confirma tu cuenta", emailBody);

				return await ConstruirToken(usuario);
			}
			else
			{
				return BadRequest(resultado.Errors);
			}
		}

		[HttpGet("confirmarEmail")]
		[AllowAnonymous]
		public async Task<IActionResult> ConfirmarEmail(string userId, string token)
		{
			var usuario = await userManager.FindByIdAsync(userId);

			if (usuario == null)
			{
				return NotFound("Usuario no encontrado.");
			}

			var resultado = await userManager.ConfirmEmailAsync(usuario, token);

			if (resultado.Succeeded)
			{
				return Redirect("https://127.0.0.1:4200/confirmar-email");
			}
			else
			{
				return BadRequest("Error al confirmar el email.");
			}
		}

		[HttpPost("login")]
		[AllowAnonymous]
		public async Task<ActionResult<RespuestaAutenticacionDTO>> Login(CredencialesUsuarioDTO credencialesUsuarioDTO)
		{
			var usuario = await userManager.FindByEmailAsync(credencialesUsuarioDTO.Email);

			if (usuario is null)
			{
				return BadRequest(new { mensaje = "El usuario no existe o el email es incorrecto." });
			}

			if (!await userManager.IsEmailConfirmedAsync(usuario))
			{
				return BadRequest(new { mensaje = "Debes confirmar tu correo electrónico antes de iniciar sesión." });
			}

			var resultado = await signInManager.CheckPasswordSignInAsync(usuario,
				credencialesUsuarioDTO.Password, lockoutOnFailure: false);

			if (resultado.Succeeded)
			{
				return await ConstruirToken(usuario);
			}
			else
			{
				return BadRequest(new { mensaje = "Email o Contraseña incorrecta." });
			}
		}

		[HttpPost("HacerAdmin")]
		public async Task<IActionResult> HacerAdmin(EditarClaimDTO editarClaimDTO)
		{
			var usuario = await userManager.FindByEmailAsync(editarClaimDTO.Email);

			if (usuario is null)
			{
				return NotFound();
			}

			await userManager.AddClaimAsync(usuario, new Claim("esadmin", "true"));
			return NoContent();
		}

		[HttpPost("RemoverAdmin")]
		public async Task<IActionResult> RemoverAdmin(EditarClaimDTO editarClaimDTO)
		{
			var usuario = await userManager.FindByEmailAsync(editarClaimDTO.Email);

			if (usuario is null)
			{
				return NotFound();
			}

			await userManager.RemoveClaimAsync(usuario, new Claim("esadmin", "true"));
			return NoContent();
		}

		[HttpPost("solicitar-restablecimiento-contrasena")]
		[AllowAnonymous]
		public async Task<IActionResult> SolicitarRestablecimientoContrasena([FromBody] SolicitarRestablecimientoDTO solicitarRestablecimientodDTO)
		{
			Console.WriteLine($"Solicitud de restablecimiento para: {solicitarRestablecimientodDTO.Email}");

			var usuario = await userManager.FindByEmailAsync(solicitarRestablecimientodDTO.Email);
			if (usuario == null)
			{
				return BadRequest("No se encontró un usuario con ese correo electrónico.");
			}

			var token = await userManager.GeneratePasswordResetTokenAsync(usuario);

			var enlace = $"https://127.0.0.1:4200/restablecer-contrasena?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(usuario.Email)}";

			var emailBody = $"<p>Por favor, restablezca su contraseña haciendo clic en este enlace: <a href='{enlace}'>Restablecer contraseña</a></p>";
			await emailService.SendEmailAsync(solicitarRestablecimientodDTO.Email, "Restablecimiento de Contraseña", emailBody);

			return Ok("Se ha enviado un enlace para restablecer la contraseña.");
		}

		[HttpPost("restablecer-contrasena")]
		[AllowAnonymous]
		public async Task<IActionResult> RestablecerContrasena([FromBody] RestablecerContrasenaDTO restablecerContrasenaDTO)
		{
			var usuario = await userManager.FindByEmailAsync(restablecerContrasenaDTO.Email);
			if (usuario == null)
			{
				return BadRequest("No se encontró un usuario con ese correo electrónico.");
			}

			var decodedToken = Uri.UnescapeDataString(restablecerContrasenaDTO.Token);

			var resultado = await userManager.ResetPasswordAsync(usuario, decodedToken, restablecerContrasenaDTO.NuevaContrasena);
			if (resultado.Succeeded)
			{
				return Ok("La contraseña se ha restablecido correctamente.");
			}

			foreach (var error in resultado.Errors)
			{
				Console.WriteLine($"Error: {error.Code}, {error.Description}");
			}
			return BadRequest(resultado.Errors);
		}



		private IEnumerable<IdentityError> ConstruirLoginIncorrecto()
		{
			var identityError = new IdentityError() { Description = "Email o contraseña incorrecta" };
			var errores = new List<IdentityError>();
			errores.Add(identityError);
			return errores;
		}

		private async Task<RespuestaAutenticacionDTO> ConstruirToken(IdentityUser identityUser)
		{
			var claims = new List<Claim>
			{
				new Claim("email", identityUser.Email),
				new Claim("sub", identityUser.Id)
			};

			var claimsDB = await userManager.GetClaimsAsync(identityUser);
			claims.AddRange(claimsDB);

			var llave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["llavejwt"]!));
			var creds = new SigningCredentials(llave, SecurityAlgorithms.HmacSha256);

			var expiracion = DateTime.UtcNow.AddYears(1);

			var tokenDeSeguridad = new JwtSecurityToken(
				issuer: null,
				audience: null,
				claims: claims,
				expires: expiracion,
				signingCredentials: creds
			);

			var token = new JwtSecurityTokenHandler().WriteToken(tokenDeSeguridad);

			return new RespuestaAutenticacionDTO
			{
				Token = token,
				Expiracion = expiracion
			};
		}
	}
}
