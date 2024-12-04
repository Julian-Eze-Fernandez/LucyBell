using AutoMapper;
using LucyBell.Server.DTOs.DetallesPedidoDTOs;
using LucyBell.Server.DTOs.PedidosDTOs;
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
		private readonly IMapper mapper;

		public PedidosController(ApplicationDbContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		[HttpPost]
		public async Task<IActionResult> CrearPedido([FromBody] PedidoCreacionDTO pedidoDTO)
		{
			// Validar stock y procesar variantes
			var detallesPedido = new List<DetallePedido>();

			foreach (var detalle in pedidoDTO.Detalles)
			{
				var variante = await context.VariantesProducto
					.Include(v => v.Producto)
					.FirstOrDefaultAsync(v => v.Id == detalle.VarianteProductoId);

				if (variante == null)
				{
					return BadRequest($"La variante con ID {detalle.VarianteProductoId} no existe.");
				}

				// Validar stock disponible
				if (variante.Cantidad < detalle.Cantidad)
				{
					return BadRequest($"Stock insuficiente para la variante con ID {detalle.VarianteProductoId}.");
				}

				// Disminuir stock de la variante
				variante.Cantidad -= detalle.Cantidad;

				// Agregar el detalle al pedido
				detallesPedido.Add(new DetallePedido
				{
					ProductoId = variante.ProductoId,
					VarianteProductoId = variante.Id,
					Cantidad = detalle.Cantidad,
					PrecioUnitario = variante.Producto.Precio
				});
			}

			// Crear el pedido
			var pedido = new Pedido
			{
				UsuarioId = pedidoDTO.UsuarioId,
				Estado = "Pendiente",
				FechaCreacion = DateTime.UtcNow,
				FechaActualizacion = DateTime.UtcNow,
				Envio = pedidoDTO.Envio,
				Total = detallesPedido.Sum(d => d.Cantidad * d.PrecioUnitario),
				DetallesPedido = detallesPedido
			};

			context.Pedidos.Add(pedido);
			await context.SaveChangesAsync();

			return Ok(pedido.Id); // Retornar el ID del pedido creado
		}

		[HttpGet("usuario/{usuarioId}")]
		public async Task<ActionResult<List<PedidoDTO>>> ObtenerPedidosUsuario(string usuarioId)
		{
			try
			{
				var pedidos = await context.Pedidos
					.Include(p => p.DetallesPedido)
						.ThenInclude(d => d.Producto)
					.Include(p => p.DetallesPedido)
						.ThenInclude(d => d.VarianteProducto)
					.Where(p => p.UsuarioId == usuarioId)
					.ToListAsync();

				if (!pedidos.Any())
					return NotFound($"No se encontraron pedidos para el usuario con ID {usuarioId}.");

				var pedidosDTO = pedidos.Select(p => new PedidoDTO
				{
					Id = p.Id,
					Total = p.Total,
					Estado = p.Estado,
					FechaCreacion = p.FechaCreacion,
					FechaActualizacion = p.FechaActualizacion,
					Envio = p.Envio,
					Detalles = p.DetallesPedido.Select(d => new DetallePedidoDTO
					{
						ProductoId = d.Producto?.Id ?? 0,
						VarianteProductoId = d.VarianteProducto?.Id,
						Cantidad = d.Cantidad,
						PrecioUnitario = d.PrecioUnitario,
						SubTotal = d.PrecioUnitario * d.Cantidad
					}).ToList()
				}).ToList();

				return pedidosDTO;
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Error interno del servidor: {ex.Message}");
			}
		}

		[HttpPut("{pedidoId}/estado")]
		public async Task<IActionResult> ActualizarEstadoPedido(int pedidoId, [FromBody] string nuevoEstado)
		{
			var pedido = await context.Pedidos.FindAsync(pedidoId);
			if (pedido == null)
				return NotFound($"El pedido con ID {pedidoId} no existe.");

			var estadosValidos = new[] { "Pendiente", "Pagado", "Cancelado" };
			if (!estadosValidos.Contains(nuevoEstado))
			{
				return BadRequest($"El estado '{nuevoEstado}' no es válido.");
			}

			pedido.Estado = nuevoEstado;
			pedido.FechaActualizacion = DateTime.UtcNow;

			await context.SaveChangesAsync();
			return Ok();
		}


	}
}
