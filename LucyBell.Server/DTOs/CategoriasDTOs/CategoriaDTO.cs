using LucyBell.Server.DTOs.ProductosDTOs;
using LucyBell.Server.DTOs.SubCategoriasDTOs;

namespace LucyBell.Server.DTOs.CategoriasDTOs
{
	public class CategoriaDTO
	{
		public int Id { get; set; }
		public string Nombre { get; set; }
		public List<SubCategoriaDTO> SubCategorias { get; set; }
		public List<ProductoDTO> Productos { get; set; }
	}
}
