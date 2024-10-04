using LucyBell.Server.DTOs.AdministracionesUsuarioDTOs;

namespace LucyBell.Server.Utilidades
{
	public static class IQueryableExtensions
	{
		public static IQueryable<T> Paginar<T>(this IQueryable<T> queryable, PaginacionDTO paginacion)
		{
			return queryable
				.Skip((paginacion.Pagina - 1) * paginacion.RecordsPorPagina)
				.Take(paginacion.RecordsPorPagina);
		}
	}
}
