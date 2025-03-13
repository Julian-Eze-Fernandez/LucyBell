namespace LucyBell.Server.DTOs.AdministracionesUsuarioDTOs
{
	public class RestablecerContrasenaDTO
	{
		public string Email { get; set; }
		public string Token { get; set; }
		public string NuevaContrasena { get; set; }
	}
}
