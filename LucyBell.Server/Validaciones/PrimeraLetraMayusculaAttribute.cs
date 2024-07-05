using System.ComponentModel.DataAnnotations;

namespace LucyBell.Server.Validaciones
{
	public class PrimeraLetraMayusculaAttribute : ValidationAttribute
	{
		//Validacion por atributo reutilizable para verificar que la primera letra sea mayuscula
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			if (value == null || string.IsNullOrEmpty(value.ToString()))
			{
				return ValidationResult.Success;
			}

			var primeraLetra = value.ToString()[0].ToString();

			if (primeraLetra != primeraLetra.ToUpper())
			{
				return new ValidationResult("La primera letra debe ser mayúscula");
			}

			return ValidationResult.Success;
		}
	}
}
