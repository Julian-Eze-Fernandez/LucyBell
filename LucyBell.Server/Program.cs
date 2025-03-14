using LucyBell.Server;
using LucyBell;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

var startup = new StartUp(builder.Configuration);

startup.ConfigureServices(builder.Services);

var app = builder.Build();

startup.Configure(app, app.Environment);

app.Run();
