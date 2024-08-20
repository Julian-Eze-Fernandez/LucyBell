using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.Entidades
{
	public class Producto
	{
		public int Id { get; set; }
		[Required(ErrorMessage = "El campo {0} es requerido")]
		[StringLength(maximumLength: 120, ErrorMessage = "El campo {0} no debe tener más de {1} carácteres")]
		public string Nombre { get; set; }
		[Required(ErrorMessage = "El campo {0} es requerido")]
		public decimal Precio { get; set; }
		public string Descripcion { get; set; }
		public List<DetalleCarrito> DetallesCarrito { get; set; }
		public List<VarianteProducto> VariantesProducto { get; set; }
		public List<Carrousel> Carrouseles { get; set; }
		public List<DetallePedido> DetallesPedido { get; set; }
        public List<ImagenProducto> ImagenesProductos { get; set; }
        public int CategoriaId { get; set; }
		public Categoria Categoria { get; set; }
		public int? SubCategoriaId { get; set; }
		public SubCategoria SubCategoria { get; set; }
		public int? MaterialId { get; set; }
		public Material Material { get; set; }
	}
}
