namespace LucyBell.Server.DTOs.DetallesPedidoDTOs
{
	public class DetallePedidoDTO
	{
		public int Id { get; set; }
		public int Cantidad { get; set; }
		public decimal PrecioUnitario { get; set; }
		public int ProductoId { get; set; }
		public int? VarianteProductoId { get; set; }
	}
}
