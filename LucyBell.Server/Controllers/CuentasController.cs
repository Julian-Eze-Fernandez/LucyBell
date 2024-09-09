using LucyBell.Server.DTOs.AdministracionesUsuarioDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/cuentas")]
	public class CuentasController : ControllerBase
	{
		private readonly UserManager<IdentityUser> userManager;
		private readonly IConfiguration configuration;
		private readonly SignInManager<IdentityUser> signInManager;

		public CuentasController(UserManager<IdentityUser> userManager, 
			IConfiguration configuration,
			SignInManager<IdentityUser> signInManager)
        {
			this.userManager = userManager;
			this.configuration = configuration;
			this.signInManager = signInManager;
		}

        [HttpPost("registrar")] // Registra nuevos usuarios
		public async Task<ActionResult<RespuestaAutenticacion>> Registrar(CredencialesUsuarios credencialesUsuarios)
		{
			// Crear un nuevo usuario en el sistema usando el email proporcionado
			var usuario = new IdentityUser { UserName = credencialesUsuarios.Email, Email = credencialesUsuarios.Email };

			// Crear el usuario en la base de datos con la contraseña proporcionada
			var resultado = await userManager.CreateAsync(usuario, credencialesUsuarios.Password);

			if (resultado != null)
			{
				return ConstruirToken(credencialesUsuarios);
			}
			else 
			{
				return BadRequest(resultado.Errors);
			}
		}


		[HttpPost] // Endpoint para iniciar sesión
		public async Task<ActionResult<RespuestaAutenticacion>> Login(CredencialesUsuarios credencialesUsuarios)
		{
			// Verifica las credenciales de inicio de sesión (email y contraseña)
			var resultado = await signInManager.PasswordSignInAsync(credencialesUsuarios.Email,
				credencialesUsuarios.Password, isPersistent: false, lockoutOnFailure: false);

			if (resultado.Succeeded)
			{
				return ConstruirToken(credencialesUsuarios);
			}
			else
			{
				return BadRequest("Login incorrecto");
			}
		}

		private RespuestaAutenticacion ConstruirToken(CredencialesUsuarios credencialesUsuarios) // Método para generar un token JWT basado en las credenciales del usuario
		{
			var claims = new List<Claim>()
			{
				new Claim("email", credencialesUsuarios.Email) // claim que almacena el email del usuario
			};

			// Se obtiene la clave secreta para firmar el token desde la configuración
			var llave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["llavejwt"]));
			var creds = new SigningCredentials(llave, SecurityAlgorithms.HmacSha256);

			var expiracion = DateTime.Now.AddYears(1);

			var securityToken = new JwtSecurityToken(issuer: null, audience: null, claims: claims,
				expires: expiracion, signingCredentials: creds);

			return new RespuestaAutenticacion()
			{
				Token = new JwtSecurityTokenHandler().WriteToken(securityToken),
				Expiracion = expiracion
			};
		}
	}
}
