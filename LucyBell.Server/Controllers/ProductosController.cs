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

		[HttpGet("lista")]
		public async Task<ActionResult<List<ProductoDTO>>> GetProductosLista()
		{
			var productos = await context.Productos.ToListAsync();
			return mapper.Map<List<ProductoDTO>>(productos);
		}

		[HttpGet("completo")]
		public async Task<ActionResult<List<ProductoCompletoDTO>>> GetProductoCompleto()
		{
			var productos = await context.Productos
				.Include(productoBD => productoBD.ImagenesProductos)
				.Include(productoBD => productoBD.VariantesProducto)
				.Include(productoBD => productoBD.Categoria)
				.ToListAsync();

			var productosDTO = productos.Select(producto => new ProductoCompletoDTO
			{
				Id = producto.Id,
				Nombre = producto.Nombre,
				Precio = producto.Precio,
				Descripcion = producto.Descripcion,
				CategoriaId = producto.CategoriaId,
				Destacado = producto.Destacado,
                CategoriaNombre = producto.Categoria.Nombre,
                SubCategoriaId = producto.SubCategoriaId,
				MaterialId = producto.MaterialId,
				ImagenesProductos = producto.ImagenesProductos.Select(img => new ImagenProductoDTO
				{
					Id = img.Id,
					UrlImagen = $"{Request.Scheme}://{Request.Host}/" + img.UrlImagen
                }).ToList(),
				VariantesProducto = producto.VariantesProducto.Select(variante => new VarianteProductoDTO
				{
					Id = variante.Id,
					Color = variante.Color,
					Cantidad = variante.Cantidad
				}).ToList(),
			}).ToList();

			return Ok(productosDTO);
		}

        [HttpGet("filtrado")]
        public async Task<ActionResult<List<ProductoCompletoDTO>>> GetProductoCompleto(
		int? categoriaId = null,
		int? subCategoriaId = null,
		int? materialId = null,
		int page = 1,
		int pageSize = 12)
        {
            // Base query including necessary related entities
            var query = context.Productos
                .Include(productoBD => productoBD.ImagenesProductos)
                .Include(productoBD => productoBD.VariantesProducto)
                .Include(productoBD => productoBD.Categoria)
                .AsQueryable();

            // Apply filters if parameters are provided
            if (categoriaId.HasValue)
            {
                query = query.Where(p => p.CategoriaId == categoriaId.Value);
            }

            if (subCategoriaId.HasValue)
            {
                query = query.Where(p => p.SubCategoriaId == subCategoriaId.Value);
            }

            if (materialId.HasValue)
            {
                query = query.Where(p => p.MaterialId == materialId.Value);
            }

            // Calculate total count before applying pagination
            var totalProducts = await query.CountAsync();

            // Apply pagination
            query = query.Skip((page - 1) * pageSize).Take(pageSize);

            // Execute the query and project results to DTO
            var productos = await query.ToListAsync();
            var productosDTO = productos.Select(producto => new ProductoCompletoDTO
            {
                Id = producto.Id,
                Nombre = producto.Nombre,
                Precio = producto.Precio,
                Descripcion = producto.Descripcion,
                CategoriaId = producto.CategoriaId,
                Destacado = producto.Destacado,
                CategoriaNombre = producto.Categoria.Nombre,
                SubCategoriaId = producto.SubCategoriaId,
                MaterialId = producto.MaterialId,
                ImagenesProductos = producto.ImagenesProductos.Select(img => new ImagenProductoDTO
                {
                    Id = img.Id,
                    UrlImagen = $"{Request.Scheme}://{Request.Host}/" + img.UrlImagen
                }).ToList(),
                VariantesProducto = producto.VariantesProducto.Select(variante => new VarianteProductoDTO
                {
                    Id = variante.Id,
                    Color = variante.Color,
                    Cantidad = variante.Cantidad
                }).ToList(),
            }).ToList();

            // Return products along with pagination info in headers
            Response.Headers.Append("X-Total-Count", totalProducts.ToString());
            Response.Headers.Append("X-Total-Pages", Math.Ceiling((double)totalProducts / pageSize).ToString());

            return Ok(productosDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoCompletoDTO>> GetProductoCompletoById(int id)
        {
            var producto = await context.Productos
                .Include(productoBD => productoBD.ImagenesProductos)
                .Include(productoBD => productoBD.VariantesProducto)
                .Include(productoBD => productoBD.Categoria)
                .FirstOrDefaultAsync(productoBD => productoBD.Id == id);

            if (producto == null)
            {
                return NotFound();
            }

            var productoDTO = new ProductoCompletoDTO
            {
                Id = producto.Id,
                Nombre = producto.Nombre,
                Precio = producto.Precio,
                Descripcion = producto.Descripcion,
                CategoriaId = producto.CategoriaId,
                Destacado = producto.Destacado,
                CategoriaNombre = producto.Categoria?.Nombre,
                SubCategoriaId = producto.SubCategoriaId,
                MaterialId = producto.MaterialId,
                ImagenesProductos = producto.ImagenesProductos.Select(img => new ImagenProductoDTO
                {
                    Id = img.Id,
                    UrlImagen = $"{Request.Scheme}://{Request.Host}/" + img.UrlImagen
                }).ToList(),
                VariantesProducto = producto.VariantesProducto.Select(variante => new VarianteProductoDTO
                {
                    Id = variante.Id,
                    Color = variante.Color,
                    Cantidad = variante.Cantidad
                }).ToList(),
            };

            return Ok(productoDTO);
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


		[HttpPut("{id}")]
        public async Task<ActionResult> PutProducto(int id,	
		[FromForm] int categoriaId,
		[FromForm] int? subCategoriaId,
		[FromForm] int? materialId,
		[FromForm] ProductoCreacionDTO productoCreacionDTO,
		[FromForm] List<IFormFile> imagenes)
		{
			var producto = mapper.Map<Producto>(productoCreacionDTO);
			producto.Id = id;
			producto.CategoriaId = categoriaId;
			producto.SubCategoriaId = subCategoriaId;
			producto.MaterialId = materialId;

			var existeCategoria = await context.Categorias.AnyAsync(categoriaDB => categoriaDB.Id == categoriaId);
			if (!existeCategoria) return NotFound();



            if ( subCategoriaId != null){
				var existeSubCategoria = await context.SubCategorias.AnyAsync(subCategoriaDB => subCategoriaDB.Id == subCategoriaId);

				 if (!existeSubCategoria)
				 {
				 	return NotFound();
				 }
			}
			
			if (materialId != null){
				var existeMaterial = await context.Materiales.AnyAsync(materialDB => materialDB.Id == materialId);

				// if (!existeMaterial)
				// {
				// 	return NotFound();
				// }
			}

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



			context.Update(producto);
			await context.SaveChangesAsync();
			return Ok(new {	isSuccess = true});
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
