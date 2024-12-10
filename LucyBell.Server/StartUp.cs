using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

namespace LucyBell.Server
{
	public class StartUp
	{
		public StartUp(IConfiguration configuration)
		{
			JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
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
			services.AddSwaggerGen( c =>
			{
				//Añade la definición de seguridad para JWT Bearer
				c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					Name = "Authorization", // Nombre del encabezado donde se enviará el toke
					Type = SecuritySchemeType.ApiKey, // Define el esquema de seguridad como "API Key"
					Scheme = "Bearer", // El esquema es Bearer (para tokens JWT)
					BearerFormat = "JWT", // El formato del token será JWT
					In = ParameterLocation.Header // El token JWT será enviado en el encabezado de la solicitud
				});

				// Define los requisitos de seguridad para la API, que requieren un token JWT
				c.AddSecurityRequirement(new OpenApiSecurityRequirement
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer"
							}
						},
						new string[]{ }
					}
				});
			}
			
			);

            services.AddCors(options =>
            {
                options.AddPolicy("NuevaPolitica", builder =>
                    {
						builder.AllowAnyOrigin() // replace with your frontend and backend ports
							   .AllowAnyHeader()
							   .AllowAnyMethod()	   
								.WithExposedHeaders("X-Total-Count", "X-Total-Pages");

                    });
            });

            services.AddAutoMapper(typeof(StartUp));

			//Agregar servicios de Identity
			services.AddIdentity<IdentityUser, IdentityRole>(options =>
			{
				options.Password.RequireDigit = true;
				options.Password.RequiredLength = 8;
				options.Password.RequireNonAlphanumeric = false;
				options.Password.RequireUppercase = true;
				options.Password.RequireLowercase = true;
				options.Password.RequiredUniqueChars = 1;
			})
				.AddEntityFrameworkStores<ApplicationDbContext>()
				.AddDefaultTokenProviders();

			services.AddScoped<UserManager<IdentityUser>>();
			services.AddScoped<SignInManager<IdentityUser>>();

			services.AddAuthentication().AddJwtBearer(opciones =>
			{
				opciones.MapInboundClaims = false;

				opciones.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = false,
					ValidateAudience = false,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["llavejwt"]!)),
					ClockSkew = TimeSpan.Zero
				};
			});

			services.AddAuthorization(opciones =>
			{
				opciones.AddPolicy("esadmin", politica => politica.RequireClaim("esadmin"));
			});

		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			//Uso de swagger en desarrollo
			if (env.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

            //Uso de swagger para SOMEE
            //app.UseSwagger();
            //app.UseSwaggerUI();

            app.UseStaticFiles();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(env.ContentRootPath, "Imagenes")),
                RequestPath = "/Imagenes"
            });

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
