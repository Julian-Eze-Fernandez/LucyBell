using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LucyBell.Server.Migrations
{
    /// <inheritdoc />
    public partial class CiudadaBarrio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ciudad",
                table: "Envios");

            migrationBuilder.RenameColumn(
                name: "Provincia",
                table: "Envios",
                newName: "Barrio");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Barrio",
                table: "Envios",
                newName: "Provincia");

            migrationBuilder.AddColumn<string>(
                name: "Ciudad",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
