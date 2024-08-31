using LucyBell.Server.Entidades;

namespace LucyBell.Server.DTOs.ModificacionesPrecioDTOs
{
	public class ModificacionPrecioDTO
	{
		public decimal PrecioViejo { get; set; }
		public decimal PrecioNuevo { get; set; }
		public DateTime FechaCambio { get; set; }
		public int ProductoId { get; set; }
	}
}
