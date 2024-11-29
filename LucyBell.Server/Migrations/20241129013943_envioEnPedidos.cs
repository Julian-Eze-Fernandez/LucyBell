using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LucyBell.Server.Migrations
{
    /// <inheritdoc />
    public partial class envioEnPedidos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Envio",
                table: "Pedidos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Envio",
                table: "Pedidos");
        }
    }
}
