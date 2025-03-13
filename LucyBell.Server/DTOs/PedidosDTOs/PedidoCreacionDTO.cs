using LucyBell.Server.DTOs.DetallesPedidoDTOs;
using LucyBell.Server.DTOs.EnviosDTOs;
using LucyBell.Server.DTOs.RetiroDTOs;

namespace LucyBell.Server.DTOs.PedidosDTOs
{
	public class PedidoCreacionDTO
	{
		public string Estado { get; set; }
		public decimal Total { get; set; }
		public string MetodoPago { get; set; }
		public DateTime FechaCreacion { get; set; }
		public DateTime FechaActualizacion { get; set; }
		public bool EsEnvio { get; set; }
		public string UsuarioId { get; set; }
		public List<DetallePedidoCreacionDTO> Detalles { get; set; }
		public EnvioCreacionDTO? Envio { get; set; }
		public RetiroCreacionDTO? Retiro { get; set; }
	}
}
