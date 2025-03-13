using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.DTOs.AdministracionesUsuarioDTOs
{
	public class CredencialesUsuarioCreacionDTO
	{
		[Required]
		public required string Nombre { get; set; }
		[Required]
		[EmailAddress]
		public required string Email { get; set; }
		[Required]
		public required string Password { get; set; }
		[Required]
		[Phone]
		public required string Telefono { get; set; }
	}
}
