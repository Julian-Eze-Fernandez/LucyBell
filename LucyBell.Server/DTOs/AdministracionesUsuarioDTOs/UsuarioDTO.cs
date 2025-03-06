using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.DTOs.AdministracionesUsuarioDTOs
{
	public class UsuarioDTO
	{
        public required string Email { get; set; }
        public required string Nombre { get; set; }
        [Phone]
        public required string Telefono { get; set; }
    }
}
