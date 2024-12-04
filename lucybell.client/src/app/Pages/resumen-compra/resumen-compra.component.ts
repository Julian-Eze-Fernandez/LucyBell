import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../Services/carrito.service';
import { Carrito } from '../../Models/Carrito';
import { PedidoService } from '../../Services/pedido.service';
import { DetallePedidoDTO, EnvioDTO, PedidoCreacionDTO, RetiroDTO } from '../../Models/Pedido';
import { SeguridadService } from '../../Services/seguridad.service';

@Component({
  selector: 'app-resumen-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resumen-compra.component.html',
  styleUrl: './resumen-compra.component.css'
})
export class ResumenCompraComponent implements OnInit {
  puntosDeRetiro: string[] = ['Punto A', 'Punto B', 'Punto C'];
  puntoRetiroSeleccionado: string = this.puntosDeRetiro[0];
  mediosDePago: string[] = ['Efectivo', 'Transferencia'];
  medioPagoSeleccionado: string = this.mediosDePago[0];
  carrito: any[] = [];
  montoProductos: number = 0;
  tarifaServicio: number = 500;
  total: number = 0;
  esEnvio: boolean = true;
  direccionEnvio: string = '';
  barrioEnvio: string = '';
  codigoPostal: string = '';
  observacion: string = '';
  nombreRetira: string = '';
  documentoRetira: string = '';
  procesando: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private seguridadService: SeguridadService
  ) {}

  ngOnInit(): void {
    this.carrito = this.carritoService.getCarrito();
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.montoProductos = this.carrito.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
    this.total = this.montoProductos + this.tarifaServicio;
  }

  confirmarCompra(): void {
    const usuarioId = this.seguridadService.obtenerUsuarioId();
  
    if (!usuarioId) {
      alert('No se pudo obtener el ID del usuario. Por favor, inicia sesión.');
      return;
    }
  
    if (this.esEnvio && (!this.direccionEnvio.trim() || !this.barrioEnvio.trim() || !this.codigoPostal.trim())) {
      alert('Por favor, ingresa todos los datos de envío.');
      return;
    }
  
    if (!this.esEnvio && (!this.puntoRetiroSeleccionado || !this.nombreRetira.trim() || !this.documentoRetira.trim())) {
      alert('Por favor, completa todos los campos de retiro.');
      return;
    }
  
    if (this.carrito.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de confirmar la compra.');
      return;
    }
  
    const detalles: DetallePedidoDTO[] = this.carrito.map((item) => ({
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      productoId: item.producto.id,
      varianteProductoId: item.varianteSeleccionada ? item.varianteSeleccionada.id : null,
    }));
  
    const envio: EnvioDTO | null = this.esEnvio
      ? {
          direccion: this.direccionEnvio,
          barrio: this.barrioEnvio,
          codigoPostal: this.codigoPostal,
          observacion: this.observacion,
          fechaEstimada: new Date().toISOString(),
        }
      : null;
  
    const retiro: RetiroDTO | null = !this.esEnvio
      ? {
          puntoRetiro: this.puntoRetiroSeleccionado,
          nombreRetira: this.nombreRetira,
          documentoRetira: this.documentoRetira,
          fechaRetiro: new Date().toISOString(),
        }
      : null;
  
    const pedido: PedidoCreacionDTO = {
      estado: 'Pendiente',
      total: this.total,
      usuarioId,
      metodoPago: this.medioPagoSeleccionado,
      detalles,
      envio,
      retiro,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      esEnvio: this.esEnvio,
    };
  
    console.log('Datos enviados al backend:', pedido);
  
    this.procesando = true;
    this.pedidoService.crearPedido(pedido).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.carritoService.eliminarCarrito();
        this.procesando = false;
        alert('Compra confirmada. ¡Gracias por tu pedido!');
      },
      error: (error) => {
        console.error('Error al registrar la compra:', error);
        this.procesando = false;
        alert('Ocurrió un error al confirmar la compra. Inténtalo nuevamente.');
      },
    });
  }
}
