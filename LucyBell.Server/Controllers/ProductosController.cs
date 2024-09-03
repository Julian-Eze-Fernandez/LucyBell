using AutoMapper;
using LucyBell.Server.DTOs.ImagenesProductoDTOs;
using LucyBell.Server.DTOs.ProductosDTOs;
using LucyBell.Server.DTOs.VariantesProductoDTO;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/productos")]
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

		[HttpGet("/productos/completo")]
		public async Task<ActionResult<List<ProductoCompletoDTO>>> GetProductoCompleto()
		{
			var productos = await context.Productos
				.Include(productoBD => productoBD.ImagenesProductos)
				.Include(productoBD => productoBD.VariantesProducto)
				.ToListAsync();

			var productosDTO = productos.Select(producto => new ProductoCompletoDTO
			{
				Id = producto.Id,
				Nombre = producto.Nombre,
				Precio = producto.Precio,
				Descripcion = producto.Descripcion,
				CategoriaId = producto.CategoriaId,
				SubCategoriaId = producto.SubCategoriaId,
				MaterialId = producto.MaterialId,
				ImagenesProductos = producto.ImagenesProductos.Select(img => new ImagenProductoDTO
				{
					Id = img.Id,
					UrlImagen = img.UrlImagen
				}).ToList(),
				VariantesProducto = producto.VariantesProducto.Select(variante => new VarianteProductoDTO
				{
					Id = variante.Id,
					Color = variante.Color,
					Cantidad = variante.Cantidad
				}).ToList()
			}).ToList();

			return Ok(productosDTO);
		}

		[HttpGet]
		public async Task<ActionResult<List<ProductoDTO>>> GetProductoFiltrado(
		int? categoriaId = null,
		int? subCategoriaId = null,
		int? materialId = null)
		{
			var query = context.Productos.AsQueryable();

			if (categoriaId.HasValue)
			{
				var existeCategoria = await context.Categorias.AnyAsync(categoriaDB => categoriaDB.Id == categoriaId.Value);

				if (!existeCategoria)
				{
					return NotFound($"No se encontró la categoría con Id {categoriaId}");
				}

				query = query.Where(productoDB => productoDB.CategoriaId == categoriaId.Value);
			}

			if (subCategoriaId.HasValue)
			{
				var existeSubCategoria = await context.SubCategorias.AnyAsync(subCategoriaDB => subCategoriaDB.Id == subCategoriaId.Value);

				if (!existeSubCategoria)
				{
					return NotFound($"No se encontró la subcategoría con Id {subCategoriaId}");
				}

				query = query.Where(productoDB => productoDB.SubCategoriaId == subCategoriaId.Value);
			}

			if (materialId.HasValue)
			{
				var existeMaterial = await context.Materiales.AnyAsync(materialDB => materialDB.Id == materialId.Value);

				if (!existeMaterial)
				{
					return NotFound($"No se encontró el material con Id {materialId}");
				}

				query = query.Where(productoDB => productoDB.MaterialId == materialId.Value);
			}

			var productos = await query.ToListAsync();

			if (productos == null || productos.Count == 0)
			{
				return NotFound("No se encontraron productos con los filtros especificados.");
			}

			return Ok(mapper.Map<List<ProductoDTO>>(productos));
		}


		[HttpPost]
		public async Task<ActionResult> PostProducto(
		[FromForm] int categoriaId,
		[FromForm] int? subCategoriaId,
		[FromForm] int? materialId,
		[FromForm] ProductoCreacionDTO productoCreacionDTO,
		[FromForm] List<IFormFile> imagenes) // Recibe las imágenes aquí
		{
			var existeCategoria = await context.Categorias.AnyAsync(categoriaDB => categoriaDB.Id == categoriaId);
			if (!existeCategoria) return NotFound();

			var producto = mapper.Map<Producto>(productoCreacionDTO);
			producto.CategoriaId = categoriaId;
			producto.SubCategoriaId = subCategoriaId;
			producto.MaterialId = materialId;

			context.Add(producto);
			await context.SaveChangesAsync();

			// Subir las imágenes si existen
			foreach (var imagen in imagenes)
			{
				if (imagen.Length > 0)
				{
					var nombreArchivo = Path.GetFileName(imagen.FileName);
					var ruta = $"Imagenes/{nombreArchivo}";

					using (var stream = new FileStream(ruta, FileMode.Create))
					{
						await imagen.CopyToAsync(stream);
					}

					// Guardar la imagen en la base de datos
					var imagenProducto = new ImagenProducto
					{
						UrlImagen = ruta,
						ProductoId = producto.Id
					};

					context.ImagenesProducto.Add(imagenProducto);
				}
			}

			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true, productoId = producto.Id });
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProducto(int id)
        {
            var producto = await context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            context.Productos.Remove(producto);
            await context.SaveChangesAsync();

            return Ok(new { isSuccess = true });
        }

    }
}
