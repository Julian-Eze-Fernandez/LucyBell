namespace LucyBell.Server.Entidades
{
	public class ModificacionPrecio
	{
        public int id { get; set; }
        public decimal PrecioViejo { get; set; }
        public decimal PrecioNuevo { get; set; }
        public DateTime FechaCambio { get; set; }
        public int ProductoId { get; set; }
        public Producto Productos { get; set; }
    }
}
