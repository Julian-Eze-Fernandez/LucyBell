using AutoMapper;
using LucyBell.Server.DTOs.ProductosDTOs;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/{categoriaId:int}/{subCategoriaId:int}/{materialId:int}/productos")]
	public class ProductosController : ControllerBase
	{
		private readonly ApplicationDbContext context;
		private readonly IMapper mapper;

		public ProductosController(ApplicationDbContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet("/productos/lista")]
		public async Task<ActionResult<List<ProductoDTO>>> GetProductosLista()
		{
			var productos = await context.Productos.ToListAsync();
			return mapper.Map<List<ProductoDTO>>(productos);
		}

		[HttpGet]
		public async Task<ActionResult<ProductoDTO>> GetProductoPorId(int categoriaId, int subCategoriaId, int materialId)
		{
			var existeCategoria = await context.Categorias.AnyAsync(categoriaDB => categoriaDB.Id == categoriaId);

			if (!existeCategoria)
			{
				return NotFound();
			}

			var existeSubCategoria = await context.SubCategorias.AnyAsync(subCategoriaDB => subCategoriaDB.Id == subCategoriaId);

			if (!existeSubCategoria)
			{
				return NotFound();
			}

			var existeMaterial = await context.Materiales.AnyAsync(materialDB => materialDB.Id == materialId);

			if (!existeMaterial)
			{
				return NotFound();
			}

			var productos = await context.Productos
				.Where(productoDB => productoDB.CategoriaId == categoriaId &&
									 productoDB.SubCategoriaId == subCategoriaId &&
									 productoDB.MaterialId == materialId)
				.FirstOrDefaultAsync();

			return mapper.Map<ProductoDTO>(productos);
		}

		[HttpPost]
		public async Task<ActionResult> PostProducto(int categoriaId, int subCategoriaId, int materialId, ProductoCreacionDTO productoCreacionDTO)
		{
			var existeCategoria = await context.Categorias.AnyAsync(categoriaDB => categoriaDB.Id == categoriaId);

			if (!existeCategoria)
			{
				return NotFound();
			}

			var existeSubCategoria = await context.SubCategorias.AnyAsync(subCategoriaDB => subCategoriaDB.Id == subCategoriaId);

			if (!existeSubCategoria)
			{
				return NotFound();
			}

			var existeMaterial = await context.Materiales.AnyAsync(materialDB => materialDB.Id == materialId);

			if (!existeMaterial)
			{
				return NotFound();
			}

			var producto = mapper.Map<Producto>(productoCreacionDTO);
			producto.CategoriaId = categoriaId;
			producto.SubCategoriaId = subCategoriaId;
			producto.MaterialId = materialId;

			context.Add(producto);
			await context.SaveChangesAsync();
            return Ok(new { isSuccess = true });
        }

		[HttpPut]
		public async Task<ActionResult> PutProducto(int categoriaId, int subCategoriaId, int materialId, int id, ProductoCreacionDTO productoCreacionDTO)
		{
			var existeCategoria = await context.Categorias.AnyAsync(categoriaDB => categoriaDB.Id == categoriaId);

			if (!existeCategoria)
			{
				return NotFound();
			}

			var existeSubCategoria = await context.SubCategorias.AnyAsync(subCategoriaDB => subCategoriaDB.Id == id);

			if (!existeSubCategoria)
			{
				return NotFound();
			}

			var existeMaterial = await context.Materiales.AnyAsync(materialDB => materialDB.Id == id);

			if (!existeMaterial)
			{
				return NotFound();
			}

			var producto = mapper.Map<Producto>(productoCreacionDTO);
			producto.Id = id;
			producto.CategoriaId = categoriaId;
			producto.SubCategoriaId = subCategoriaId;
			producto.MaterialId = materialId;

			context.Update(producto);
			await context.SaveChangesAsync();
			return NoContent();
		}
	}
}
