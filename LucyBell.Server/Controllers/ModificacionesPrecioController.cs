using AutoMapper;
using LucyBell.Server.DTOs.IngresosProductoDTO;
using LucyBell.Server.DTOs.ModificacionesPrecioDTOs;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/modificacionesPrecio")]
	public class ModificacionesPrecioController : ControllerBase
	{
		private readonly ApplicationDbContext context;
		private readonly IMapper mapper;

		public ModificacionesPrecioController(ApplicationDbContext context, IMapper mapper)
        {
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<List<ModificacionPrecioDTO>>> GetModificacionesPrecio()
		{
			var modificacion = await context.ModificacionesPrecio.ToListAsync();
			return mapper.Map<List<ModificacionPrecioDTO>>(modificacion);
		}

		[HttpPost]
		public async Task<ActionResult> PostModificacionPrecio(int productoId, ModificacionPrecioCreacionDTO modificacionPrecioCreacionDTO)
		{
			var producto = await context.Productos.FindAsync(productoId);

			if (producto == null)
			{
				return NotFound();
			}

			modificacionPrecioCreacionDTO.PrecioViejo = producto.Precio;

			producto.Precio = modificacionPrecioCreacionDTO.PrecioNuevo;

			var modificacion = mapper.Map<ModificacionPrecio>(modificacionPrecioCreacionDTO);

			modificacion.FechaCambio = DateTime.Now.ToLocalTime();
			modificacion.ProductoId = productoId;

			context.Add(modificacion);
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}
	}
}
