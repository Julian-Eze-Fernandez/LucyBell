using LucyBell.Server.DTOs.DetallesPedidoDTOs;

namespace LucyBell.Server.DTOs.PedidosDTOs
{
	public class PedidoCreacionDTO
	{
		public decimal Total { get; set; } // El total calculado del pedido
		public string UsuarioId { get; set; } // El ID del usuario que realiza el pedido
		public string Envio { get; set; } // Dirección de envío
		public List<DetallePedidoCreacionDTO> Detalles { get; set; } // Lista de detalles del pedido
	}
}
