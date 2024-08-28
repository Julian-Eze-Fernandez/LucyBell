namespace LucyBell.Server.DTOs.ProductosDTOs
{
	public class ProductoSinVariantesDTO
	{
		public int Id { get; set; }
		public string Nombre { get; set; }
		public decimal Precio { get; set; }
		public string Descripcion { get; set; }
		public int CategoriaId { get; set; }
		public int? SubCategoriaId { get; set; }
		public int? MaterialId { get; set; }
	}
}
