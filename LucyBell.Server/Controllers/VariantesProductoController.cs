using AutoMapper;
using LucyBell.Server.DTOs.MaterialesDTOs;
using LucyBell.Server.DTOs.ProductosDTOs;
using LucyBell.Server.DTOs.VariantesProductoDTO;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/variantesProductos")]
	public class VariantesProductoController : ControllerBase
	{
		private readonly ApplicationDbContext context;
		private readonly IMapper mapper;

		public VariantesProductoController(ApplicationDbContext context, IMapper mapper)
        {
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<List<VarianteProductoDTO>>> GetVariantesConProductos()
		{
			var variantes = await context.VariantesProducto.ToListAsync();
			return mapper.Map<List<VarianteProductoDTO>>(variantes);
		}

		[HttpPost("{id}")]
		public async Task<ActionResult> PostVariantesProductos(int id, List<VarianteProductoCreacionDTO> variantesProductoCreacionDTO)
		{
			var existeProducto = await context.Productos.AnyAsync(productoDB => productoDB.Id == id);
			if (!existeProducto)
			{
				return NotFound();
			}

			var variantesAIgresar = new List<VarianteProducto>();

			foreach (var varianteDTO in variantesProductoCreacionDTO)
			{
				var existeVarianteConElMismoColor = await context.VariantesProducto.AnyAsync(x => x.Color == varianteDTO.Color && x.ProductoId == id);

				if (existeVarianteConElMismoColor)
				{
					return BadRequest($"Ya existe una Variante con el color {varianteDTO.Color} para este producto");
				}

				var variante = mapper.Map<VarianteProducto>(varianteDTO);
				variante.ProductoId = id;

				variantesAIgresar.Add(variante);
			}

			context.AddRange(variantesAIgresar);
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}

		[HttpPut]
		public async Task<ActionResult> PutVariantesProductos(int productoId, int id, VarianteProductoCreacionDTO varianteProductoCreacionDTO)
		{
			var existeProducto = await context.Productos.AnyAsync(productoDB => productoDB.Id == productoId);
			if (!existeProducto)
			{
				return NotFound();
			}

			var existeVarianteProducto = await context.VariantesProducto.AnyAsync(varianteProductoDB => varianteProductoDB.Id == id);
			if (!existeVarianteProducto)
			{
				return NotFound();
			}

			var variante = mapper.Map<VarianteProducto>(varianteProductoCreacionDTO);
			variante.Id = id;
			variante.ProductoId = productoId;

			context.Update(variante);
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteVariantesProductos(int id)
		{
			var existeVarianteProducto = await context.VariantesProducto.AnyAsync(varianteProductoDB => varianteProductoDB.Id == id);
			
			if (!existeVarianteProducto)
			{
				return NotFound();
			}

			context.Remove(new VarianteProducto() { Id = id });
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}
	}
}
