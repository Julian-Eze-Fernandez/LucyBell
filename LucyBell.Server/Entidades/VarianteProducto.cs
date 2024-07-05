namespace LucyBell.Server.Entidades
{
	public class VarianteProducto
	{
		public int Id { get; set; }
		public string Color { get; set; }
		public string Talle { get; set; }
		public decimal Precio { get; set; }
		public int Stock { get; set; }
		public int ProductoId { get; set; }
		public Producto Producto { get; set; }
	}
}
