using LucyBell.Server.DTOs.DetallesPedidoDTOs;

namespace LucyBell.Server.DTOs.PedidosDTOs
{
	public class PedidoDTO
	{
		public int Id { get; set; }
		public string Estado { get; set; }
		public decimal Total { get; set; }
		public string Envio { get; set; } // Dirección de envío
		public DateTime FechaCreacion { get; set; }
		public DateTime FechaActualizacion { get; set; }
		public string UsuarioId { get; set; }
		public List<DetallePedidoDTO> Detalles { get; set; }
	}
}
