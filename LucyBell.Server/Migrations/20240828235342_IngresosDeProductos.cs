using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LucyBell.Server.Migrations
{
    /// <inheritdoc />
    public partial class IngresosDeProductos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "VariantesProducto",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "IngresosProducto",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    FechaIngreso = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VarianteProductoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngresosProducto", x => x.id);
                    table.ForeignKey(
                        name: "FK_IngresosProducto_VariantesProducto_VarianteProductoId",
                        column: x => x.VarianteProductoId,
                        principalTable: "VariantesProducto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IngresosProducto_VarianteProductoId",
                table: "IngresosProducto",
                column: "VarianteProductoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IngresosProducto");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "VariantesProducto",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
