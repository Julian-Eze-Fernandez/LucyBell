namespace LucyBell.Server.DTOs.EnviosDTOs
{
	public class EnvioCreacionDTO
	{
		public string Direccion { get; set; }
		public string Ciudad { get; set; }
		public string Provincia { get; set; }
		public string CodigoPostal { get; set; }
		public DateTime FechaEstimada { get; set; }
	}
}
