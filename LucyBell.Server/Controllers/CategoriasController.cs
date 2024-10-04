using AutoMapper;
using LucyBell.Server.DTOs.CategoriasDTOs;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/categorias")]
	//[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "esadmin")]

	public class CategoriasController : ControllerBase
	{
		private readonly ApplicationDbContext context;
		private readonly IMapper mapper;
        

        public CategoriasController(ApplicationDbContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<List<CategoriaDTO>>> GetCategoriasLista()
		{
			var categorias = await context.Categorias
				.Include(c => c.SubCategorias)
                .ToListAsync();
			return mapper.Map<List<CategoriaDTO>>(categorias);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<CategoriaDTO>> GetCategoriaId(int id)
		{
			var categoria = await context.Categorias
				.Include(categoriaBD => categoriaBD.SubCategorias).FirstOrDefaultAsync(x => x.Id == id); //Incluye la lista de subcategorias

			if (categoria == null)
			{
				return NotFound();
			}

			return mapper.Map<CategoriaDTO>(categoria);
		}

		[HttpGet("/api/categorias/{id}/productos")] //Get que muestra que productos estan en x categoria
		public async Task<ActionResult<CategoriaDTO>> GetCategoriaIdConProductos(int id)
		{
			var categoria = await context.Categorias
				.Include(categoriaBD => categoriaBD.Productos)
				.FirstOrDefaultAsync(x => x.Id == id); //Incluye la lista de productos

			if (categoria == null)
			{
				return NotFound();
			}

			return mapper.Map<CategoriaDTO>(categoria);
		}

		[HttpPost]
		public async Task<ActionResult> PostCategoria([FromForm] CategoriaCreacionDTO categoriaCreacionDTO, IFormFile? imagen)
		{
			var existeCategoriaConElMismoNombre = await context.Categorias.AnyAsync(x => x.Nombre == categoriaCreacionDTO.Nombre);

			if (existeCategoriaConElMismoNombre)
			{
				return BadRequest($"Ya existe una categoria con el nombre {categoriaCreacionDTO.Nombre}");
			}

            string? urlImagen = null;

            if (imagen != null)
            {
                // Save the image (e.g., to a folder or cloud storage) and get the URL
                var filePath = Path.Combine("Imagenes", imagen.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imagen.CopyToAsync(stream);
                }
                urlImagen = $"Imagenes/{imagen.FileName}"; // Construct the URL for the saved image
            }

            var categoria = mapper.Map<Categoria>(categoriaCreacionDTO);
            categoria.UrlImagen = urlImagen;

            context.Add(categoria);
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}

		[HttpPut("{id}")]
        public async Task<ActionResult> PutCategoria([FromForm] CategoriaCreacionDTO categoriaCreacionDTO, int id, IFormFile? imagen)
        {
            var categoriaExistente = await context.Categorias.FirstOrDefaultAsync(x => x.Id == id);

            if (categoriaExistente == null)
            {
                return NotFound();
            }

            string? urlImagen = categoriaExistente.UrlImagen; 

            if (imagen != null)
            {
                var filePath = Path.Combine("Imagenes", imagen.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imagen.CopyToAsync(stream);
                }

                urlImagen = $"Imagenes/{imagen.FileName}"; 
            }

            var categoria = mapper.Map(categoriaCreacionDTO, categoriaExistente); 

            categoria.Id = id;
            categoria.UrlImagen = urlImagen; 

            context.Update(categoria);
            await context.SaveChangesAsync();
            return Ok(new { isSuccess = true });
        }

        [HttpDelete("{id}")]
		public async Task<ActionResult> DeleteCategoria(int id)
		{
            var categoria = await context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound();
            }

            // Remove the entity
            context.Categorias.Remove(categoria);
            await context.SaveChangesAsync();

            return Ok(new { isSuccess = true });
        }
	}
}
