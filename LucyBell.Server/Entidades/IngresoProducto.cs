namespace LucyBell.Server.Entidades
{
    public class IngresoProducto
    {
        public int id { get; set; }
        public int Cantidad { get; set; }
        public DateTime FechaIngreso { get; set; } 
        public int VarianteProductoId { get; set; }
        public VarianteProducto VarianteProducto { get; set; }
    }
}
