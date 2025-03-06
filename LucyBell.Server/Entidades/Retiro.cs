namespace LucyBell.Server.Entidades
{
	public class Retiro
	{
		public int Id { get; set; }
		public string PuntoRetiro { get; set; }
		public string NombreRetira { get; set; }
		public string DocumentoRetira { get; set; }
		public DateTime FechaRetiro { get; set; }
		public int PedidoId { get; set; }
		public Pedido Pedido { get; set; }
	}
}
