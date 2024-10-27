using AutoMapper;
using LucyBell.Server.DTOs.SubCategoriasDTOs;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/categorias/{categoriaId}/subCategorias")]
	public class SubCategoriasController : ControllerBase
	{
		private readonly ApplicationDbContext context;
		private readonly IMapper mapper;

		public SubCategoriasController(ApplicationDbContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet("/subcategorias/lista")]
		public async Task<ActionResult<List<SubCategoriaDTO>>> GetSubCategoriasLista()
		{
			var subCategorias = await context.SubCategorias.ToListAsync();

            return mapper.Map<List<SubCategoriaDTO>>(subCategorias);
		}

		[HttpGet]
		public async Task<ActionResult<List<SubCategoriaDTO>>> GetSubCategoriaPorCategoria(int categoriaId)
		{
			var existeCategoria = await context.Categorias.AnyAsync(categoriaDB => categoriaDB.Id == categoriaId);

			if (!existeCategoria)
			{
				return NotFound();
			}

			var subCategorias = await context.SubCategorias
				.Where(subCategoriaDB => subCategoriaDB.CategoriaId == categoriaId).ToListAsync();

			return mapper.Map<List<SubCategoriaDTO>>(subCategorias);
		}

		[HttpGet("/api/subcategoria/{id}/productos")] //Get que muestra que productos estan en x subcategoria
		public async Task<ActionResult<SubCategoriaDTO>> GetSubCategoriaId(int id)
		{
			var subCategoria = await context.SubCategorias
				.Include(subCategoriaBD => subCategoriaBD.Productos)
				.FirstOrDefaultAsync(x => x.Id == id); //Incluye la lista de productos

			if (subCategoria == null)
			{
				return NotFound();
			}

			return mapper.Map<SubCategoriaDTO>(subCategoria);
		}

		[HttpPost]
		public async Task<ActionResult> PostSubCategoria(int categoriaId, SubCategoriaCreacionDTO subCategoriaCreacionDTO)
		{
			var existeCategoria = await context.Categorias.AnyAsync(categoriaDB => categoriaDB.Id == categoriaId);

			if (!existeCategoria)
			{
				return NotFound();
			}

			var subCategoria = mapper.Map<SubCategoria>(subCategoriaCreacionDTO);
			subCategoria.CategoriaId = categoriaId;
			context.Add(subCategoria);
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}

		[HttpPut("{id}")]
		public async Task<ActionResult> PutSubCategoria(int categoriaId, int id, SubCategoriaCreacionDTO subCategoriaCreacionDTO)
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

			var subCategoria = mapper.Map<SubCategoria>(subCategoriaCreacionDTO);
			subCategoria.Id = id;
			subCategoria.CategoriaId = categoriaId;

			context.Update(subCategoria);
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteSubCategoria(int id)
		{
			var existeSubCategoria = await context.SubCategorias.AnyAsync(x => x.Id == id);

			if (!existeSubCategoria)
			{
				return NotFound();
			}

			context.Remove(new SubCategoria() { Id = id });
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
		}
	}
}
