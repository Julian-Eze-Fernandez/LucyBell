using LucyBell.Server.DTOs.DetallesPedidoDTOs;
using LucyBell.Server.DTOs.EnviosDTOs;
using LucyBell.Server.DTOs.PedidosDTOs;
using LucyBell.Server.DTOs.RetiroDTOs;
using LucyBell.Server.DTOs.VariantesProductoDTO;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/pedidos")]
	public class PedidosController : ControllerBase
	{
		private readonly ApplicationDbContext context;

		public PedidosController(ApplicationDbContext context)
		{
			this.context = context;
		}

		[HttpGet("usuario/{usuarioId}")]
		public async Task<ActionResult<List<PedidoDTO>>> ObtenerPedidosUsuario(string usuarioId)
		{
			var pedidos = await context.Pedidos
				.Where(p => p.UsuarioId == usuarioId)
				.Include(p => p.DetallesPedido)
				.ThenInclude(d => d.Producto)
				.Include(p => p.Envio)
				.Include(p => p.Retiro)
				.ToListAsync();

			if (pedidos == null || !pedidos.Any())
				return NotFound("No se encontraron pedidos para este usuario.");

			var pedidosDTO = pedidos.Select(p => new PedidoDTO
			{
				Id = p.Id,
				Estado = p.Estado,
				Total = p.Total,
				MetodoPago = p.MetodoPago,
				FechaCreacion = p.FechaCreacion,
				FechaActualizacion = p.FechaActualizacion,
				EsEnvio = p.EsEnvio,
				Detalles = p.DetallesPedido.Select(d => new DetallePedidoDTO
				{
					Id = d.Id,
					Cantidad = d.Cantidad,
					PrecioUnitario = d.PrecioUnitario,
					ProductoId = d.ProductoId,
					VarianteProductoId = d.VarianteProductoId
				}).ToList(),
				Envio = p.Envio != null ? new EnvioDTO
				{
					Direccion = p.Envio.Direccion,
					Barrio = p.Envio.Barrio,
					CodigoPostal = p.Envio.CodigoPostal,
					Observacion = p.Envio.Observacion,
					FechaEstimada = p.Envio.FechaEstimada
				} : null,
				Retiro = p.Retiro != null ? new RetiroDTO
				{
					PuntoRetiro = p.Retiro.PuntoRetiro,
					NombreRetira = p.Retiro.NombreRetira,
					DocumentoRetira = p.Retiro.DocumentoRetira,
					FechaRetiro = p.Retiro.FechaRetiro
				} : null
			}).ToList();

			return pedidosDTO;
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<PedidoDTO>> ObtenerPedidoPorId(int id)
		{
			var pedido = await context.Pedidos
				.Include(p => p.DetallesPedido)
				.ThenInclude(d => d.Producto)
				.Include(p => p.Envio)
				.Include(p => p.Retiro)
				.FirstOrDefaultAsync(p => p.Id == id);

			if (pedido == null)
				return NotFound("El pedido no existe.");

			var pedidoDTO = new PedidoDTO
			{
				Id = pedido.Id,
				Estado = pedido.Estado,
				Total = pedido.Total,
				MetodoPago = pedido.MetodoPago,
				FechaCreacion = pedido.FechaCreacion,
				FechaActualizacion = pedido.FechaActualizacion,
				EsEnvio = pedido.EsEnvio,
				Detalles = pedido.DetallesPedido.Select(d => new DetallePedidoDTO
				{
					Id = d.Id,
					Cantidad = d.Cantidad,
					PrecioUnitario = d.PrecioUnitario,
					ProductoId = d.ProductoId,
					VarianteProductoId = d.VarianteProductoId
				}).ToList(),
				Envio = pedido.Envio != null ? new EnvioDTO
				{
					Direccion = pedido.Envio.Direccion,
					Barrio = pedido.Envio.Barrio,
					CodigoPostal = pedido.Envio.CodigoPostal,
					Observacion = pedido.Envio.Observacion,
					FechaEstimada = pedido.Envio.FechaEstimada
				} : null,
				Retiro = pedido.Retiro != null ? new RetiroDTO
				{
					PuntoRetiro = pedido.Retiro.PuntoRetiro,
					NombreRetira = pedido.Retiro.NombreRetira,
					DocumentoRetira = pedido.Retiro.DocumentoRetira,
					FechaRetiro = pedido.Retiro.FechaRetiro
				} : null
			};

			return pedidoDTO;
		}

		[HttpGet("pendientes")]
		public async Task<ActionResult<List<PedidoDTO>>> ObtenerPedidosPendientes()
		{
			var pedidosPendientes = await context.Pedidos
				.Where(p => p.Estado == "Pendiente")
				.Include(p => p.DetallesPedido)
				.ThenInclude(d => d.Producto)
				.Include(p => p.Envio)
				.Include(p => p.Retiro)
				.ToListAsync();

			if (!pedidosPendientes.Any())
				return NotFound("No se encontraron pedidos pendientes.");

			var pedidosDTO = pedidosPendientes.Select(p => new PedidoDTO
			{
				Id = p.Id,
				Estado = p.Estado,
				Total = p.Total,
				MetodoPago = p.MetodoPago,
				FechaCreacion = p.FechaCreacion,
				FechaActualizacion = p.FechaActualizacion,
				EsEnvio = p.EsEnvio,
				Detalles = p.DetallesPedido.Select(d => new DetallePedidoDTO
				{
					Id = d.Id,
					Cantidad = d.Cantidad,
					PrecioUnitario = d.PrecioUnitario,
					ProductoId = d.ProductoId,
					VarianteProductoId = d.VarianteProductoId
				}).ToList(),
				Envio = p.Envio != null ? new EnvioDTO
				{
					Direccion = p.Envio.Direccion,
					Barrio = p.Envio.Barrio,
					CodigoPostal = p.Envio.CodigoPostal,
					Observacion = p.Envio.Observacion,
					FechaEstimada = p.Envio.FechaEstimada
				} : null,
				Retiro = p.Retiro != null ? new RetiroDTO
				{
					PuntoRetiro = p.Retiro.PuntoRetiro,
					NombreRetira = p.Retiro.NombreRetira,
					DocumentoRetira = p.Retiro.DocumentoRetira,
					FechaRetiro = p.Retiro.FechaRetiro
				} : null
			}).ToList();

			return pedidosDTO;
		}

		[HttpGet("finalizados")]
		public async Task<ActionResult<List<PedidoDTO>>> ObtenerPedidosFinalizados()
		{
			var estadosFinalizados = new[] { "Pagado", "Cancelado" };
			var pedidosFinalizados = await context.Pedidos
				.Where(p => estadosFinalizados.Contains(p.Estado))
				.Include(p => p.DetallesPedido)
				.ThenInclude(d => d.Producto)
				.Include(p => p.Envio)
				.Include(p => p.Retiro)
				.ToListAsync();

			if (!pedidosFinalizados.Any())
				return NotFound("No se encontraron pedidos pagados o cancelados.");

			var pedidosDTO = pedidosFinalizados.Select(p => new PedidoDTO
			{
				Id = p.Id,
				Estado = p.Estado,
				Total = p.Total,
				MetodoPago = p.MetodoPago,
				FechaCreacion = p.FechaCreacion,
				FechaActualizacion = p.FechaActualizacion,
				EsEnvio = p.EsEnvio,
				Detalles = p.DetallesPedido.Select(d => new DetallePedidoDTO
				{
					Id = d.Id,
					Cantidad = d.Cantidad,
					PrecioUnitario = d.PrecioUnitario,
					ProductoId = d.ProductoId,
					VarianteProductoId = d.VarianteProductoId
				}).ToList(),
				Envio = p.Envio != null ? new EnvioDTO
				{
					Direccion = p.Envio.Direccion,
					Barrio = p.Envio.Barrio,
					CodigoPostal = p.Envio.CodigoPostal,
					Observacion = p.Envio.Observacion,
					FechaEstimada = p.Envio.FechaEstimada
				} : null,
				Retiro = p.Retiro != null ? new RetiroDTO
				{
					PuntoRetiro = p.Retiro.PuntoRetiro,
					NombreRetira = p.Retiro.NombreRetira,
					DocumentoRetira = p.Retiro.DocumentoRetira,
					FechaRetiro = p.Retiro.FechaRetiro
				} : null
			}).ToList();

			return pedidosDTO;
		}

		[HttpPost]
		public async Task<ActionResult> CrearPedido([FromBody] PedidoCreacionDTO pedidoCreacionDTO)
		{
			if (pedidoCreacionDTO == null)
				return BadRequest("El pedido es nulo.");

			var variantesIds = pedidoCreacionDTO.Detalles
				.Where(d => d.VarianteProductoId.HasValue)
				.Select(d => d.VarianteProductoId.Value)
				.ToList();

			var variantes = await context.VariantesProducto
				.Where(v => variantesIds.Contains(v.Id))
				.ToListAsync();

			foreach (var detalle in pedidoCreacionDTO.Detalles)
			{
				if (detalle.VarianteProductoId.HasValue)
				{
					var variante = variantes.FirstOrDefault(v => v.Id == detalle.VarianteProductoId.Value);
					if (variante == null)
						return BadRequest($"La variante con ID {detalle.VarianteProductoId} no existe.");

					if (variante.Cantidad < detalle.Cantidad)
						return BadRequest($"No hay suficiente stock para la variante con ID {detalle.VarianteProductoId}. Stock actual: {variante.Cantidad}");
				}
			}

			foreach (var detalle in pedidoCreacionDTO.Detalles)
			{
				if (detalle.VarianteProductoId.HasValue)
				{
					var variante = variantes.First(v => v.Id == detalle.VarianteProductoId.Value);
					variante.Cantidad -= detalle.Cantidad;
				}
			}

			var pedido = new Pedido
			{
				Estado = pedidoCreacionDTO.Estado,
				Total = pedidoCreacionDTO.Total,
				MetodoPago = pedidoCreacionDTO.MetodoPago,
				FechaCreacion = pedidoCreacionDTO.FechaCreacion,
				FechaActualizacion = pedidoCreacionDTO.FechaActualizacion,
				EsEnvio = pedidoCreacionDTO.EsEnvio,
				UsuarioId = pedidoCreacionDTO.UsuarioId,
				DetallesPedido = pedidoCreacionDTO.Detalles.Select(d => new DetallePedido
				{
					Cantidad = d.Cantidad,
					PrecioUnitario = d.PrecioUnitario,
					ProductoId = d.ProductoId,
					VarianteProductoId = d.VarianteProductoId
				}).ToList(),
				Envio = pedidoCreacionDTO.Envio != null ? new Envio
				{
					Direccion = pedidoCreacionDTO.Envio.Direccion,
					Barrio = pedidoCreacionDTO.Envio.Barrio,
					CodigoPostal = pedidoCreacionDTO.Envio.CodigoPostal,
					Observacion = pedidoCreacionDTO.Envio.Observacion,
					FechaEstimada = pedidoCreacionDTO.Envio.FechaEstimada
				} : null,
				Retiro = pedidoCreacionDTO.Retiro != null ? new Retiro
				{
					PuntoRetiro = pedidoCreacionDTO.Retiro.PuntoRetiro,
					NombreRetira = pedidoCreacionDTO.Retiro.NombreRetira,
					DocumentoRetira = pedidoCreacionDTO.Retiro.DocumentoRetira,
					FechaRetiro = pedidoCreacionDTO.Retiro.FechaRetiro
				} : null
			};



			context.Pedidos.Add(pedido);
			await context.SaveChangesAsync();

			return CreatedAtAction(nameof(ObtenerPedidoPorId), new { id = pedido.Id }, pedido.Id);
		}

		[HttpPut("{id}/estado")]
		public async Task<ActionResult> ActualizarEstadoPedido(int id, [FromBody] string nuevoEstado)
		{
			var pedido = await context.Pedidos.FindAsync(id);

			if (pedido == null)
				return NotFound("El pedido no existe.");

			pedido.Estado = nuevoEstado;
			pedido.FechaActualizacion = DateTime.Now;

			await context.SaveChangesAsync();

			return NoContent();
		}

	}
}
