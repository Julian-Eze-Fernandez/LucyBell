namespace LucyBell.Server.DTOs.EnviosDTOs
{
	public class EnvioDTO
	{
		public int Id { get; set; }
		public string Direccion { get; set; }
		public string Barrio { get; set; }
		public string CodigoPostal { get; set; }
		public string Observacion { get; set; }
		public DateTime FechaEstimada { get; set; }
	}
}
