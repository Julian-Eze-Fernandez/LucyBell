using LucyBell.Server.DTOs.ProductosDTOs;

namespace LucyBell.Server.DTOs.SubCategoriasDTOs
{
	public class SubCategoriaDTO
	{
		public int Id { get; set; }
		public string Nombre { get; set; }
		public List<ProductoDTO> Productos { get; set; }
	}
}
