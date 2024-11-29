namespace LucyBell.Server.DTOs.DetallesPedidoDTOs
{
	public class DetallePedidoDTO
	{
		public int Id { get; set; }
		public int ProductoId { get; set; }
		public string ProductoNombre { get; set; } // Opcional: nombre del producto para mostrar en el frontend
		public int? VarianteProductoId { get; set; }
		public string? VarianteColor { get; set; } // Opcional: color u otra característica de la variante
		public int Cantidad { get; set; }
		public decimal PrecioUnitario { get; set; }
		public decimal SubTotal { get; set; } // Calculado como Cantidad * PrecioUnitario
	}
}
