using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.DTOs.AdministracionesUsuarioDTOs
{
	public class CredencialesUsuarios
	{
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
