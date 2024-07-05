namespace LucyBell.Server.Entidades
{
	public class Carrito
	{
		public int Id { get; set; }
		public DateTime FechaCreacion { get; set; }
		public DateTime FechaActualizacion { get; set; }
		public int ClienteId { get; set; }
		public Cliente Cliente { get; set; }
		public List<DetalleCarrito> DetallesCarrito { get; set; }
	}
}
