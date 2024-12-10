using AutoMapper;
using LucyBell.Server.DTOs.AdministracionesUsuarioDTOs;
using LucyBell.Server.DTOs.CategoriasDTOs;
using LucyBell.Server.DTOs.DetallesPedidoDTOs;
using LucyBell.Server.DTOs.EnviosDTOs;
using LucyBell.Server.DTOs.ImagenesProductoDTOs;
using LucyBell.Server.DTOs.IngresosProductoDTO;
using LucyBell.Server.DTOs.MaterialesDTOs;
using LucyBell.Server.DTOs.ModificacionesPrecioDTOs;
using LucyBell.Server.DTOs.PedidosDTOs;
using LucyBell.Server.DTOs.ProductosDTOs;
using LucyBell.Server.DTOs.RetiroDTOs;
using LucyBell.Server.DTOs.SubCategoriasDTOs;
using LucyBell.Server.DTOs.VariantesProductoDTO;
using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Identity;

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
			CreateMap<Producto, ProductoCompletoDTO>(); //Mapeo para GET COMPLETO

			CreateMap<VarianteProductoCreacionDTO, VarianteProducto>(); //Mapeo para POST
			CreateMap<VarianteProducto, VarianteProductoDTO>(); //Mapeo para GET

			CreateMap<IngresoProductoCreacionDTO, IngresoProducto>(); //Mapeo para POST
			CreateMap<IngresoProducto, IngresoProductoDTO>(); //Mapeo para GET

			CreateMap<ModificacionPrecioCreacionDTO, ModificacionPrecio>(); //Mapeo para POST
			CreateMap<ModificacionPrecio, ModificacionPrecioDTO>(); //Mapeo para GET

			CreateMap<IdentityUser, UsuarioDTO>() //Mapeo para GET
			   .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
			   .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.UserName))
			   .ForMember(dest => dest.Telefono, opt => opt.MapFrom(src => src.PhoneNumber));

			CreateMap<DetallePedidoCreacionDTO, DetallePedido>();  //Mapeo para POST
			CreateMap<DetallePedido, DetallePedidoDTO>() //Mapeo para GET
				.ForMember(dest => dest.Producto, opt => opt.MapFrom(src => src.Producto));

			CreateMap<EnvioCreacionDTO, Envio>();  //Mapeo para POST
			CreateMap<Envio, EnvioDTO>(); //Mapeo para GET

			CreateMap<RetiroCreacionDTO, Retiro>();  //Mapeo para POST
			CreateMap<Retiro, RetiroDTO>(); //Mapeo para GET

			CreateMap<ImagenProducto, ImagenProductoDTO>(); //Mapeo para GET

			CreateMap<PedidoCreacionDTO, Pedido>() //Mapeo para POST
				.ForMember(dest => dest.DetallesPedido, opt => opt.MapFrom(src => src.Detalles))
				.ForMember(dest => dest.Envio, opt => opt.MapFrom(src => src.Envio))
				.ForMember(dest => dest.Retiro, opt => opt.MapFrom(src => src.Retiro));
			CreateMap<Pedido, PedidoDTO>() //Mapeo para GET
				.ForMember(dest => dest.Detalles, opt => opt.MapFrom(src => src.DetallesPedido))
				.ForMember(dest => dest.Envio, opt => opt.MapFrom(src => src.Envio))
				.ForMember(dest => dest.Retiro, opt => opt.MapFrom(src => src.Retiro))
				.ForMember(dest => dest.Usuario, opt => opt.MapFrom(src => src.Usuario));


		}
	}
}
