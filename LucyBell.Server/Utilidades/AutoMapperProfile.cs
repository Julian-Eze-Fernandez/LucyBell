using AutoMapper;
using LucyBell.Server.DTOs.CategoriasDTOs;
using LucyBell.Server.DTOs.MaterialesDTOs;
using LucyBell.Server.DTOs.ProductosDTOs;
using LucyBell.Server.DTOs.SubCategoriasDTOs;
using LucyBell.Server.Entidades;

namespace LucyBell.Server.Utilidades
{
	public class AutoMapperProfiles : Profile
	{
		public AutoMapperProfiles()
		{
			//Para mappear va priemro la Fuente y luego el Destino
			//CreateMap<Fuente, Destino>();

			CreateMap<CategoriaCreacionDTO, Categoria>(); //Mapeo para POST
			CreateMap<Categoria, CategoriaDTO>(); //Mapeo para GET
			CreateMap<SubCategoriaCreacionDTO, SubCategoria>(); //Mapeo para POST
			CreateMap<SubCategoria, SubCategoriaDTO>(); //Mapeo para GET
			CreateMap<MaterialCreacionDTO, Material>(); //Mapeo para POST
			CreateMap<Material, MaterialDTO>(); //Mapeo para GET
			CreateMap<ProductoCreacionDTO, Producto>(); //Mapeo para POST
			CreateMap<Producto, ProductoDTO>(); //Mapeo para GET
		}
	}
}
