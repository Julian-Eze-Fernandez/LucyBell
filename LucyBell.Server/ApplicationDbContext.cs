using LucyBell.Server.Entidades;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Reflection.Emit;

namespace LucyBell.Server
{
	public class ApplicationDbContext : IdentityDbContext
	{
		public ApplicationDbContext(DbContextOptions options) : base(options)
		{

		}

		public DbSet<Categoria> Categorias { get; set; }
		public DbSet<DetallePedido> DetallesPedido { get; set; }
		public DbSet<Material> Materiales { get; set; }
		public DbSet<Pedido> Pedidos { get; set; }
		public DbSet<Producto> Productos { get; set; }
		public DbSet<SubCategoria> SubCategorias { get; set; }
		public DbSet<VarianteProducto> VariantesProducto { get; set; }
        public DbSet<ImagenProducto> ImagenesProducto { get; set; }
        public DbSet<IngresoProducto> IngresosProducto { get; set; }
        public DbSet<ModificacionPrecio> ModificacionesPrecio { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			var cascadeFKs = modelBuilder.Model.GetEntityTypes()
				.SelectMany(t => t.GetForeignKeys())
				.Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

			foreach (var fk in cascadeFKs)
			{
				fk.DeleteBehavior = DeleteBehavior.Restrict;
			}

			modelBuilder.Entity<Producto>()
                .HasMany(p => p.ImagenesProductos)
				.WithOne(c => c.Producto)
				.OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
		}
	}
}
