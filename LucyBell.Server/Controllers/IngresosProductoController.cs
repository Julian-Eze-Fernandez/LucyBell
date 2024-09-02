using AutoMapper;
using LucyBell.Server.DTOs.IngresosProductoDTO;
using LucyBell.Server.DTOs.ProductosDTOs;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/ingresosProductos")]
	public class IngresosProductoController : ControllerBase
	{
		private readonly ApplicationDbContext context;
		private readonly IMapper mapper;

		public IngresosProductoController(ApplicationDbContext context, IMapper mapper)
        {
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<List<IngresoProductoDTO>>> GetIngresosProductoLista()
		{
			var ingreso = await context.IngresosProducto.ToListAsync();
			return mapper.Map<List<IngresoProductoDTO>>(ingreso);
		}

		[HttpPost]
		public async Task<ActionResult> PostIngresoProducto(int varianteProductoId, IngresoProductoCreacionDTO ingresoProductoCreacionDTO)
		{
			var varianteProducto = await context.VariantesProducto.FindAsync(varianteProductoId);

			if (varianteProducto == null)
			{
				return NotFound();
			}

			varianteProducto.Cantidad += ingresoProductoCreacionDTO.Cantidad;

			var ingreso = mapper.Map<IngresoProducto>(ingresoProductoCreacionDTO);

			ingreso.FechaIngreso = DateTime.Now.ToLocalTime();
			ingreso.VarianteProductoId = varianteProductoId;

			context.Add(ingreso);
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}


	}
}
