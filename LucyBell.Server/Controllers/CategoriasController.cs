using AutoMapper;
using LucyBell.Server.DTOs.CategoriasDTOs;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/categorias")]

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
			var categorias = await context.Categorias.ToListAsync();
			return mapper.Map<List<CategoriaDTO>>(categorias);
		}

		[HttpGet("{id:int}")]
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

		[HttpGet("/api/categorias/{id:int}/productos")] //Get que muestra que productos estan en x categoria
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
		public async Task<ActionResult> PostCategoria(CategoriaCreacionDTO categoriaCreacionDTO)
		{
			var existeCategoriaConElMismoNombre = await context.Categorias.AnyAsync(x => x.Nombre == categoriaCreacionDTO.Nombre);

			if (existeCategoriaConElMismoNombre)
			{
				return BadRequest($"Ya existe una categoria con el nombre {categoriaCreacionDTO.Nombre}");
			}

			var categoria = mapper.Map<Categoria>(categoriaCreacionDTO);

			context.Add(categoria);
			await context.SaveChangesAsync();
			return Ok();
		}

		[HttpPut("(id:int)")]
		public async Task<ActionResult> PutCategoria(CategoriaCreacionDTO categoriaCreacionDTO, int id)
		{
			var existe = await context.Categorias.AnyAsync(x => x.Id == id);

			if (!existe)
			{
				return NotFound();
			}

			var categoria = mapper.Map<Categoria>(categoriaCreacionDTO);
			categoria.Id = id;

			context.Update(categoria);
			await context.SaveChangesAsync();
			return NoContent();
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
