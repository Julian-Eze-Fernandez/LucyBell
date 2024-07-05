namespace LucyBell.Server.Entidades
{
	public class Carrousel
	{
		public int Id { get; set; }
		public int ProductoId { get; set; }
		public Producto Producto { get; set; }
	}
}
