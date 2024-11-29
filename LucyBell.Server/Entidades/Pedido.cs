using Microsoft.AspNetCore.Identity;

namespace LucyBell.Server.Entidades
{
	public class Pedido
	{
		public int Id { get; set; }
		public string Estado { get; set; }
		public decimal Total { get; set; }
		public string Envio { get; set; }
		public DateTime FechaCreacion { get; set; }
		public DateTime FechaActualizacion { get; set; }

		public required string UsuarioId { get; set; }
		public IdentityUser Usuario { get; set; }
		public List<DetallePedido> DetallesPedido { get; set; }

	}
}
