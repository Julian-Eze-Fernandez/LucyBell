using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LucyBell.Server.Migrations
{
    /// <inheritdoc />
    public partial class actualizacionPedidoa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FechaPedido",
                table: "Pedidos",
                newName: "FechaCreacion");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaActualizacion",
                table: "Pedidos",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "PedidoId",
                table: "DetallesPedido",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProductoId",
                table: "DetallesPedido",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VarianteProductoId",
                table: "DetallesPedido",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DetallesPedido_PedidoId",
                table: "DetallesPedido",
                column: "PedidoId");

            migrationBuilder.CreateIndex(
                name: "IX_DetallesPedido_ProductoId",
                table: "DetallesPedido",
                column: "ProductoId");

            migrationBuilder.CreateIndex(
                name: "IX_DetallesPedido_VarianteProductoId",
                table: "DetallesPedido",
                column: "VarianteProductoId");

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesPedido_Pedidos_PedidoId",
                table: "DetallesPedido",
                column: "PedidoId",
                principalTable: "Pedidos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesPedido_Productos_ProductoId",
                table: "DetallesPedido",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesPedido_VariantesProducto_VarianteProductoId",
                table: "DetallesPedido",
                column: "VarianteProductoId",
                principalTable: "VariantesProducto",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetallesPedido_Pedidos_PedidoId",
                table: "DetallesPedido");

            migrationBuilder.DropForeignKey(
                name: "FK_DetallesPedido_Productos_ProductoId",
                table: "DetallesPedido");

            migrationBuilder.DropForeignKey(
                name: "FK_DetallesPedido_VariantesProducto_VarianteProductoId",
                table: "DetallesPedido");

            migrationBuilder.DropIndex(
                name: "IX_DetallesPedido_PedidoId",
                table: "DetallesPedido");

            migrationBuilder.DropIndex(
                name: "IX_DetallesPedido_ProductoId",
                table: "DetallesPedido");

            migrationBuilder.DropIndex(
                name: "IX_DetallesPedido_VarianteProductoId",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "FechaActualizacion",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "PedidoId",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "ProductoId",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "VarianteProductoId",
                table: "DetallesPedido");

            migrationBuilder.RenameColumn(
                name: "FechaCreacion",
                table: "Pedidos",
                newName: "FechaPedido");
        }
    }
}
