using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.DTOs.SubCategoriasDTOs
{
	public class SubCategoriaCreacionDTO
	{
		[Required(ErrorMessage = "El campo {0} es requerido")]
		[StringLength(maximumLength: 120, ErrorMessage = "El campo {0} no debe tener más de {1} carácteres")]
		public string Nombre { get; set; }
	}
}
