using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LucyBell.Server.Migrations
{
    /// <inheritdoc />
    public partial class CampoEstadoSinRestriccion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CHK_EstadoPedido",
                table: "Pedidos");

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Pedidos",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "Pendiente");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Pedidos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "Pendiente",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddCheckConstraint(
                name: "CHK_EstadoPedido",
                table: "Pedidos",
                sql: "Estado IN ('Pendiente', 'Pagado', 'Cancelado')");
        }
    }
}
