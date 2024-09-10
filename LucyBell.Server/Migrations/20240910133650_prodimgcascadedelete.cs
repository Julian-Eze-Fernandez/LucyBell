using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LucyBell.Server.Migrations
{
    /// <inheritdoc />
    public partial class prodimgcascadedelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImagenesProducto_Productos_ProductoId",
                table: "ImagenesProducto");

            migrationBuilder.AddForeignKey(
                name: "FK_ImagenesProducto_Productos_ProductoId",
                table: "ImagenesProducto",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImagenesProducto_Productos_ProductoId",
                table: "ImagenesProducto");

            migrationBuilder.AddForeignKey(
                name: "FK_ImagenesProducto_Productos_ProductoId",
                table: "ImagenesProducto",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
