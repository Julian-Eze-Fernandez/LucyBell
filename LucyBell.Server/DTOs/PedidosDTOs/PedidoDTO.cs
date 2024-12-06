using LucyBell.Server.DTOs.AdministracionesUsuarioDTOs;
using LucyBell.Server.DTOs.DetallesPedidoDTOs;
using LucyBell.Server.DTOs.EnviosDTOs;
using LucyBell.Server.DTOs.RetiroDTOs;

namespace LucyBell.Server.DTOs.PedidosDTOs
{
	public class PedidoDTO
	{
		public int Id { get; set; }
		public string Estado { get; set; }
		public decimal Total { get; set; }
		public string MetodoPago { get; set; }
		public DateTime FechaCreacion { get; set; }
		public DateTime FechaActualizacion { get; set; }
		public bool EsEnvio { get; set; }
		public List<DetallePedidoDTO> Detalles { get; set; }
		public EnvioDTO? Envio { get; set; }
		public RetiroDTO? Retiro { get; set; }
		public UsuarioDTO Usuario { get; set; }
	}
}
