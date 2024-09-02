namespace LucyBell.Server.Entidades
{
	public class VarianteProducto
	{
		public int Id { get; set; }
		public string? Color { get; set; }
		public int Cantidad { get; set; }
		public int ProductoId { get; set; }
		public Producto Producto { get; set; }
        public List<IngresoProducto> IngresosProducto { get; set; }
    }
}
