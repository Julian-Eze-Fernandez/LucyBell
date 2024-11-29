namespace LucyBell.Server.DTOs.DetallesPedidoDTOs
{
	public class DetallePedidoCreacionDTO
	{
		public int ProductoId { get; set; }
		public int? VarianteProductoId { get; set; } // Es opcional si no hay variantes
		public int Cantidad { get; set; }
		public decimal PrecioUnitario { get; set; }
	}
}
