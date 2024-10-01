using LucyBell.Server.DTOs.AdministracionesUsuarioDTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

		public UsuariosController(UserManager<IdentityUser> userManager,
			IConfiguration configuration,
			SignInManager<IdentityUser> signInManager)
		{
			this.userManager = userManager;
			this.configuration = configuration;
			this.signInManager = signInManager;
		}

		[HttpPost("registrar")]
		public async Task<ActionResult<RespuestaAutenticacionDTO>> Registrar(CredencialesUsuarioDTO credencialesUsuarioDTO)
		{
			var usuario = new IdentityUser
			{
				Email = credencialesUsuarioDTO.Email,
				UserName = credencialesUsuarioDTO.Email
			};

			var resultado = await userManager.CreateAsync(usuario, credencialesUsuarioDTO.Password);

			if (resultado.Succeeded)
			{
				return await ConstruirToken(usuario);
			}
			else
			{
				return BadRequest(resultado.Errors);
			}
		}

		[HttpPost("login")]
		[AllowAnonymous]
		public async Task<ActionResult<RespuestaAutenticacionDTO>> Login(CredencialesUsuarioDTO credencialesUsuarioDTO)
		{
			var usuario = await userManager.FindByEmailAsync(credencialesUsuarioDTO.Email);

			if (usuario is null)
			{
				var errores = ConstruirLoginIncorrecto();
				return BadRequest(errores);
			}

			var resultado = await signInManager.CheckPasswordSignInAsync(usuario,
				credencialesUsuarioDTO.Password, lockoutOnFailure: false);

			if (resultado.Succeeded)
			{
				return await ConstruirToken(usuario);
			}
			else
			{
				var errores = ConstruirLoginIncorrecto();
				return BadRequest(errores);
			}
		}

		private IEnumerable<IdentityError> ConstruirLoginIncorrecto()
		{
			var identityError = new IdentityError() { Description = "Login incorrecto" };
			var errores = new List<IdentityError>();
			errores.Add(identityError);
			return errores;
		}

		private async Task<RespuestaAutenticacionDTO> ConstruirToken(IdentityUser identityUser)
		{
			var claims = new List<Claim>
			{
				new Claim("email", identityUser.Email)
			};

			var claimsDB = await userManager.GetClaimsAsync(identityUser);

			claims.AddRange(claimsDB);

			var llave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["llavejwt"]!));
			var creds = new SigningCredentials(llave, SecurityAlgorithms.HmacSha256);

			var expiracion = DateTime.UtcNow.AddYears(1);

			var tokenDeSeguridad = new JwtSecurityToken(issuer: null, audience: null, claims: claims,
				expires: expiracion, signingCredentials: creds);

			var token = new JwtSecurityTokenHandler().WriteToken(tokenDeSeguridad);

			return new RespuestaAutenticacionDTO
			{
				Token = token,
				Expiracion = expiracion
			};
		}
	}
}
