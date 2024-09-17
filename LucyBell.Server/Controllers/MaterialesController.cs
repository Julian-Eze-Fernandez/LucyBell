 using AutoMapper;
using LucyBell.Server.DTOs.MaterialesDTOs;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LucyBell.Server.Controllers
{
	[ApiController]
	[Route("api/materiales")]
	public class MaterialesController : ControllerBase
	{
		private readonly ApplicationDbContext context;
		private readonly IMapper mapper;

		public MaterialesController(ApplicationDbContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<List<MaterialDTO>>> GetMaterialesLista()
		{
			var materiales = await context.Materiales.ToListAsync();
			return mapper.Map<List<MaterialDTO>>(materiales);
		}

		[HttpGet("{id:int}")]
		public async Task<ActionResult<MaterialDTO>> GetMaterialId(int id)
		{
			var material = await context.Materiales
				.Include(materialBD => materialBD.Productos).FirstOrDefaultAsync(x => x.Id == id);

			if (material == null)
			{
				return NotFound();
			}

			return mapper.Map<MaterialDTO>(material);
		}

		[HttpPost]
		public async Task<ActionResult> PostMaterial(MaterialCreacionDTO materialCreacionDTO)
		{
			var existeMaterialConElMismoNombre = await context.Materiales.AnyAsync(x => x.Nombre == materialCreacionDTO.Nombre);

			if (existeMaterialConElMismoNombre)
			{
				return BadRequest($"Ya existe un material con el nombre {materialCreacionDTO.Nombre}");
			}

			var material = mapper.Map<Material>(materialCreacionDTO);

			context.Add(material);
			await context.SaveChangesAsync();
			return Ok(new { isSuccess = true });
        }

		[HttpPut("{id}")]
		public async Task<ActionResult> PutMaterial(MaterialCreacionDTO materialCreacionDTO, int id)
		{
			var existe = await context.Materiales.AnyAsync(x => x.Id == id);

			if (!existe)
			{
				return NotFound();
			}

			var material = mapper.Map<Material>(materialCreacionDTO);
			material.Id = id;

			context.Update(material);
			await context.SaveChangesAsync();
            return Ok(new { isSuccess = true });
        }

		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteMaterial(int id)
		{
			var existe = await context.Materiales.AnyAsync(x => x.Id == id);

			if (!existe)
			{
				return NotFound();
			}

			context.Remove(new Material() { Id = id });
			await context.SaveChangesAsync();

			return Ok(new { isSuccess = true });
		}
	}
}
