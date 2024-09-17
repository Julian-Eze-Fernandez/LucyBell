using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.Entidades
{
	public class SubCategoria
	{
		public int Id { get; set; }
		[Required(ErrorMessage = "El campo {0} es requerido")]
		[StringLength(maximumLength: 120, ErrorMessage = "El campo {0} no debe tener más de {1} carácteres")]
		public string Nombre { get; set; }
		public int CategoriaId { get; set; }
		public Categoria Categoria { get; set; }
		public List<Producto> Productos { get; set; }
	}
}
