using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.Entidades
{
	public class Categoria
	{
		public int Id { get; set; }
		[Required(ErrorMessage = "El campo {0} es requerido")]
		[StringLength(maximumLength: 120, ErrorMessage = "El campo {0} no debe tener más de {1} carácteres")]
		public string Nombre { get; set; }

        public string? UrlImagen { get; set; }
        public List<Producto> Productos { get; set; }
		public List<SubCategoria> SubCategorias { get; set; }
	}
}
