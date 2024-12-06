using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LucyBell.Server.Migrations
{
    /// <inheritdoc />
    public partial class observacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Observacion",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Observacion",
                table: "Envios");
        }
    }
}
