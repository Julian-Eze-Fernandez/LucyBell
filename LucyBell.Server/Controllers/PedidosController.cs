using AutoMapper;
using LucyBell.Server.DTOs.AdministracionesUsuarioDTOs;
using LucyBell.Server.DTOs.DetallesPedidoDTOs;
using LucyBell.Server.DTOs.EnviosDTOs;
using LucyBell.Server.DTOs.ImagenesProductoDTOs;
using LucyBell.Server.DTOs.PedidosDTOs;
using LucyBell.Server.DTOs.ProductosDTOs;
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
		private readonly IMapper mapper;

		public PedidosController(ApplicationDbContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet("pendientes")]
		public async Task<ActionResult<List<PedidoDTO>>> ObtenerPedidosPendientes()
		{
			var pedidosPendientes = await context.Pedidos
				.Where(p => p.Estado == "Pendiente")
				.Include(p => p.DetallesPedido)
					.ThenInclude(d => d.Producto)
						.ThenInclude(prod => prod.ImagenesProductos)
				.Include(p => p.Envio)
				.Include(p => p.Retiro)
				.Join(context.Users,
					  pedido => pedido.UsuarioId,
					  usuario => usuario.Id,
					  (pedido, usuario) => new { Pedido = pedido, Usuario = usuario })
				.ToListAsync();

			if (!pedidosPendientes.Any())
				return NotFound("No se encontraron pedidos pendientes.");

			var pedidosDTO = pedidosPendientes.Select(p => new PedidoDTO
			{
				Id = p.Pedido.Id,
				Estado = p.Pedido.Estado,
				Total = p.Pedido.Total,
				MetodoPago = p.Pedido.MetodoPago,
				FechaCreacion = p.Pedido.FechaCreacion,
				FechaActualizacion = p.Pedido.FechaActualizacion,
				EsEnvio = p.Pedido.EsEnvio,
				Detalles = p.Pedido.DetallesPedido.Select(d => new DetallePedidoDTO
				{
					Id = d.Id,
					Cantidad = d.Cantidad,
					PrecioUnitario = d.PrecioUnitario,
					ProductoId = d.ProductoId,
					VarianteProductoId = d.VarianteProductoId,
					Producto = new ProductoDTO // Mapeo de datos del producto
					{
						Id = d.Producto.Id,
						Nombre = d.Producto.Nombre,
						Precio = d.Producto.Precio,
						Descripcion = d.Producto.Descripcion,
						CategoriaId = d.Producto.CategoriaId,
						SubCategoriaId = d.Producto.SubCategoriaId,
						MaterialId = d.Producto.MaterialId,
						ImagenesProductos = d.Producto.ImagenesProductos.Select(img => new ImagenProductoDTO
						{
							Id = img.Id,
                            UrlImagen = $"{Request.Scheme}://{Request.Host}/" + img.UrlImagen,
                            SlotIndex = img.SlotIndex
						}).ToList()
					}
				}).ToList(),
				Envio = p.Pedido.Envio != null ? new EnvioDTO
				{
					Direccion = p.Pedido.Envio.Direccion,
					Barrio = p.Pedido.Envio.Barrio,
					CodigoPostal = p.Pedido.Envio.CodigoPostal,
					Observacion = p.Pedido.Envio.Observacion,
					FechaEstimada = p.Pedido.Envio.FechaEstimada
				} : null,
				Retiro = p.Pedido.Retiro != null ? new RetiroDTO
				{
					PuntoRetiro = p.Pedido.Retiro.PuntoRetiro,
					NombreRetira = p.Pedido.Retiro.NombreRetira,
					DocumentoRetira = p.Pedido.Retiro.DocumentoRetira,
					FechaRetiro = p.Pedido.Retiro.FechaRetiro
				} : null,
				Usuario = new UsuarioDTO
				{
					Email = p.Usuario.Email,
					Nombre = p.Usuario.UserName,
					Telefono = p.Usuario.PhoneNumber
				}
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
						.ThenInclude(prod => prod.ImagenesProductos)
				.Include(p => p.Envio)
				.Include(p => p.Retiro)
				.Join(context.Users,
					  pedido => pedido.UsuarioId,
					  usuario => usuario.Id,
					  (pedido, usuario) => new { Pedido = pedido, Usuario = usuario })
				.ToListAsync();

			if (!pedidosFinalizados.Any())
				return NotFound("No se encontraron pedidos pagados o cancelados.");

			var pedidosDTO = pedidosFinalizados.Select(p => new PedidoDTO
			{
				Id = p.Pedido.Id,
				Estado = p.Pedido.Estado,
				Total = p.Pedido.Total,
				MetodoPago = p.Pedido.MetodoPago,
				FechaCreacion = p.Pedido.FechaCreacion,
				FechaActualizacion = p.Pedido.FechaActualizacion,
				EsEnvio = p.Pedido.EsEnvio,
				Detalles = p.Pedido.DetallesPedido.Select(d => new DetallePedidoDTO
				{
					Id = d.Id,
					Cantidad = d.Cantidad,
					PrecioUnitario = d.PrecioUnitario,
					ProductoId = d.ProductoId,
					VarianteProductoId = d.VarianteProductoId,
					Producto = new ProductoDTO // Mapeo de datos del producto
					{
						Id = d.Producto.Id,
						Nombre = d.Producto.Nombre,
						Precio = d.Producto.Precio,
						Descripcion = d.Producto.Descripcion,
						CategoriaId = d.Producto.CategoriaId,
						SubCategoriaId = d.Producto.SubCategoriaId,
						MaterialId = d.Producto.MaterialId,
						ImagenesProductos = d.Producto.ImagenesProductos.Select(img => new ImagenProductoDTO
						{
							Id = img.Id,
                            UrlImagen = $"{Request.Scheme}://{Request.Host}/" + img.UrlImagen,
                            SlotIndex = img.SlotIndex
						}).ToList()
					}
				}).ToList(),
				Envio = p.Pedido.Envio != null ? new EnvioDTO
				{
					Direccion = p.Pedido.Envio.Direccion,
					Barrio = p.Pedido.Envio.Barrio,
					CodigoPostal = p.Pedido.Envio.CodigoPostal,
					Observacion = p.Pedido.Envio.Observacion,
					FechaEstimada = p.Pedido.Envio.FechaEstimada
				} : null,
				Retiro = p.Pedido.Retiro != null ? new RetiroDTO
				{
					PuntoRetiro = p.Pedido.Retiro.PuntoRetiro,
					NombreRetira = p.Pedido.Retiro.NombreRetira,
					DocumentoRetira = p.Pedido.Retiro.DocumentoRetira,
					FechaRetiro = p.Pedido.Retiro.FechaRetiro
				} : null,
				Usuario = new UsuarioDTO
				{
					Email = p.Usuario.Email,
					Nombre = p.Usuario.UserName,
					Telefono = p.Usuario.PhoneNumber
				}
			}).ToList();

			return pedidosDTO;
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

			if (!pedidos.Any())
				return NotFound("No se encontraron pedidos para este usuario.");

			var pedidosDTO = mapper.Map<List<PedidoDTO>>(pedidos);
			return Ok(pedidosDTO);
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

			var pedidoDTO = mapper.Map<PedidoDTO>(pedido);
			return Ok(pedidoDTO);
		}

		[HttpPost]
		public async Task<ActionResult> CrearPedido([FromBody] PedidoCreacionDTO pedidoCreacionDTO)
		{
			if (pedidoCreacionDTO == null)
				return BadRequest("El pedido es nulo.");

			// Verificar stock de variantes
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

			// Actualizar stock
			foreach (var detalle in pedidoCreacionDTO.Detalles)
			{
				if (detalle.VarianteProductoId.HasValue)
				{
					var variante = variantes.First(v => v.Id == detalle.VarianteProductoId.Value);
					variante.Cantidad -= detalle.Cantidad;
				}
			}

			// Mapear el DTO a la entidad
			var pedido = mapper.Map<Pedido>(pedidoCreacionDTO);

			context.Pedidos.Add(pedido);
			await context.SaveChangesAsync();

			return CreatedAtAction(nameof(ObtenerPedidoPorId), new { id = pedido.Id }, pedido.Id);
		}

		[HttpPut("{id}/estado")]
		public async Task<ActionResult> ActualizarEstadoPedido(int id, string nuevoEstado)
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
