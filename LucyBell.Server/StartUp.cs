using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
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

            services.AddCors(options =>
            {
                options.AddPolicy("NuevaPolitica", builder =>
                    {
						builder.AllowAnyOrigin() // replace with your frontend and backend ports
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

			// Uso de swagger para SOMEE
			//app.UseSwagger();
			//app.UseSwaggerUI();

			app.UseHttpsRedirection();

            app.UseCors("NuevaPolitica");

            app.UseRouting();

			app.UseAuthorization();

            app.UseEndpoints(endpoint =>
			{
				endpoint.MapControllers();
			});
		}
	}
}
