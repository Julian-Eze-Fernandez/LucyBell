using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.DTOs.AdministracionesUsuarioDTOs
{
	public class CredencialesUsuarioDTO
	{
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
