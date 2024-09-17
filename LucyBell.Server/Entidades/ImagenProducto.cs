namespace LucyBell.Server.Entidades
{
	public class ImagenProducto
	{
        public int Id { get; set; }
        public string UrlImagen { get; set; }
        public int ProductoId { get; set; }
        public Producto Producto { get; set; }
    }
}
