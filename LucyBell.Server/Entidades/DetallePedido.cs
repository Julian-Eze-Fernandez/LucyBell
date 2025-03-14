﻿namespace LucyBell.Server.Entidades
{
	public class DetallePedido
	{
		public int Id { get; set; }
		public int Cantidad { get; set; }
		public decimal PrecioUnitario { get; set; }

		public int PedidoId { get; set; }
		public Pedido Pedido { get; set; }
		public int ProductoId { get; set; }
		public Producto Producto { get; set; }
		public int? VarianteProductoId { get; set; }
		public VarianteProducto VarianteProducto { get; set; }
	}
}
