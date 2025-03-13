using LucyBell.Server.DTOs.ImagenesProductoDTOs;
using LucyBell.Server.DTOs.VariantesProductoDTO;
using LucyBell.Server.Entidades;
using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.DTOs.ProductosDTOs
{
	public class ProductoCompletoDTO
	{
		public int Id { get; set; }
		public string Nombre { get; set; }
		public decimal Precio { get; set; }
		public string? Descripcion { get; set; }
		public bool Destacado { get; set; }
		public int CategoriaId { get; set; }
        public string CategoriaNombre { get; set; }
        public int? SubCategoriaId { get; set; }
		public int? MaterialId { get; set; }
		public List<VarianteProductoDTO> VariantesProducto { get; set; }
		public List<ImagenProductoDTO> ImagenesProductos { get; set; }
	}
}
