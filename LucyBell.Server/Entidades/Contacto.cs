namespace LucyBell.Server.Entidades
{
	public class Contacto
	{
		public int Id { get; set; }
		public string Nombre { get; set; }
		public string Email { get; set; }
		public string Mensaje { get; set; }
		public DateTime FechaEnvio { get; set; }
	}
}
