using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace LucyBell.Server
{
	public class StartUp
	{
		public StartUp(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		public void ConfigureServices(IServiceCollection services)
		{
			//Evita que en los Gets se generen bucles 
			services.AddControllers().AddJsonOptions(x =>
				x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

			services.AddDbContext<ApplicationDbContext>(options =>
				options.UseSqlServer(Configuration.GetConnectionString("defaultConnection")));

			services.AddEndpointsApiExplorer();
			services.AddSwaggerGen();

			//Agregar servicios de Identity
			services.AddIdentity<IdentityUser, IdentityRole>()
				.AddEntityFrameworkStores<ApplicationDbContext>()
				.AddDefaultTokenProviders();

			// Agregar servicios de CORS 
			services.AddCors(options =>
			{
				options.AddPolicy("NuevaPolitica",
					app =>
					{
						app.WithOrigins("http://localhost:4200") // replace with your frontend and backend ports
							   .AllowAnyHeader()
							   .AllowAnyMethod();
					});
			});

			services.AddAutoMapper(typeof(StartUp));
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			//Uso de swagger en desarrollo
			if (env.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseAuthorization();

			app.UseCors("NuevaPolitica");

			app.UseEndpoints(endpoint =>
			{
				endpoint.MapControllers();
			});
		}
	}
}
