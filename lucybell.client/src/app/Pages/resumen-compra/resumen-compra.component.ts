import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../Services/carrito.service';
import { PedidoService } from '../../Services/pedido.service';
import { DetallePedidoDTO, EnvioDTO, PedidoCreacionDTO, RetiroDTO } from '../../Models/Pedido';
import { SeguridadService } from '../../Services/seguridad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resumen-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resumen-compra.component.html',
  styleUrl: './resumen-compra.component.css'
})
export class ResumenCompraComponent implements OnInit {
  puntosDeRetiro: string[] = ['Barrio Talleres', 'Patio Olmos', 'Nuevo Centro Shopping'];
  puntoRetiroSeleccionado: string = this.puntosDeRetiro[0];
  mediosDePago: string[] = ['Efectivo', 'Transferencia'];
  medioPagoSeleccionado: string = this.mediosDePago[0];
  carrito: any[] = [];
  montoProductos: number = 0;
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
    private seguridadService: SeguridadService,
    private router: Router
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
    this.total = this.montoProductos;
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
  
    this.procesando = true;
    this.pedidoService.crearPedido(pedido).subscribe({
      next: (response) => {
        this.carritoService.eliminarCarrito();
        this.procesando = false;

        const mensajeWhatsApp = this.generarMensajeWhatsApp();
        const numeroTelefono = '543516122069';
        const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeWhatsApp)}`;
        window.open(urlWhatsApp, '_blank');

        this.volverTienda();

      },
      error: (error) => {
        console.error('Error al registrar la compra:', error);
        this.procesando = false;
        alert('Ocurrió un error al confirmar la compra. Inténtalo nuevamente.');
      },
    });
  }

  volverTienda(): void {
    this.router.navigate(['/productos']);
  } 

  generarMensajeWhatsApp(): string {
    let mensaje = `Hola, me gustaria confirmar mi pedido!\n\nDetalles del Pedido:\n`;
    this.carrito.forEach((item, index) => {
      mensaje += `${index + 1}. Producto: ${item.producto.nombre}\n`;
      mensaje += `   - Color: ${item.varianteSeleccionada?.color || 'No disponible'}\n`;
      mensaje += `   - Cantidad: ${item.cantidad}\n`;
      mensaje += `   - Precio Unitario: $${item.producto.precio}\n`;
    });
    mensaje += `\nTotal: $${this.total}\n`;
    
    if (this.esEnvio) {
      mensaje += `\nMétodo de Entrega: Envío a Domicilio\n`;
      mensaje += `Dirección: ${this.direccionEnvio}, Barrio: ${this.barrioEnvio}, CP: ${this.codigoPostal}\n`;
      mensaje += `Observaciones: ${this.observacion || 'Ninguna'}\n`;
    } else {
      mensaje += `\nMétodo de Entrega: Retiro\n`;
      mensaje += `Punto de encuentro para retirar: ${this.puntoRetiroSeleccionado}\n`;
      mensaje += `Nombre de quien retira: ${this.nombreRetira}\n`;
      mensaje += `Documento: ${this.documentoRetira}\n`;
    }
  
    mensaje += `\nMétodo de Pago: ${this.medioPagoSeleccionado}\n`;
    return mensaje;
  }
}
