using LucyBell.Server.DTOs.ProductosDTOs;
using LucyBell.Server.Entidades;

namespace LucyBell.Server.DTOs.VariantesProductoDTO
{
	public class VarianteProductoDTO
	{
		public int Id { get; set; }
		public string? Color { get; set; }
		public int Cantidad { get; set; }
	}
}
