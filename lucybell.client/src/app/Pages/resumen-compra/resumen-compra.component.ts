import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../Services/carrito.service';
import { Carrito } from '../../Models/Carrito';
import { PedidoService } from '../../Services/pedido.service';
import { Pedido  } from '../../Models/Pedido';
import { SeguridadService } from '../../Services/seguridad.service';

@Component({
  selector: 'app-resumen-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resumen-compra.component.html',
  styleUrl: './resumen-compra.component.css'
})
export class ResumenCompraComponent implements OnInit {
  // puntosDeRetiro: string[] = ['Punto A', 'Punto B', 'Punto C'];
  // puntoRetiroSeleccionado: string = this.puntosDeRetiro[0];
  // mediosDePago: string[] = ['Efectivo', 'Transferencia'];
  // medioPagoSeleccionado: string = this.mediosDePago[0];
  // carrito: any[] = [];
  // montoProductos: number = 0;
  // tarifaServicio: number = 500;
  // total: number = 0;
  // esEnvio: boolean = true;
  // direccionEnvio: string = '';
  // ciudadEnvio: string = '';
  // provinciaEnvio: string = '';
  // codigoPostal: string = '';
  // nombreRetira: string = '';
  // documentoRetira: string = '';
  // procesando: boolean = false;

  // constructor(
  //   private carritoService: CarritoService,
  //   private pedidoService: PedidoService,
  //   private seguridadService: SeguridadService
  // ) {}

  // ngOnInit(): void {
  //   this.carrito = this.carritoService.getCarrito();
  //   this.calcularTotales();
  // }

  // calcularTotales(): void {
  //   this.montoProductos = this.carrito.reduce(
  //     (total, item) => total + item.producto.precio * item.cantidad,
  //     0
  //   );
  //   this.total = this.montoProductos + this.tarifaServicio;
  // }

  // confirmarCompra(): void {
  //   const usuarioId = this.seguridadService.obtenerUsuarioId();
  
  //   if (!usuarioId) {
  //     alert('No se pudo obtener el ID del usuario. Por favor, inicia sesión.');
  //     return;
  //   }
  
  //   // Validaciones de envío
  //   if (this.esEnvio && (!this.direccionEnvio.trim() || !this.ciudadEnvio.trim() || !this.provinciaEnvio.trim() || !this.codigoPostal.trim())) {
  //     alert('Por favor, ingresa todos los datos de envío.');
  //     return;
  //   }
  
  //   // Validaciones de retiro
  //   if (!this.esEnvio && (!this.puntoRetiroSeleccionado || !this.nombreRetira.trim() || !this.documentoRetira.trim())) {
  //     alert('Por favor, completa todos los campos de retiro.');
  //     return;
  //   }
  
  //   if (this.carrito.length === 0) {
  //     alert('El carrito está vacío. Agrega productos antes de confirmar la compra.');
  //     return;
  //   }
  
  //   // Preparar los detalles del pedido
  //   const detalles: DetallePedidoDTO[] = this.carrito.map((item) => ({
  //     cantidad: item.cantidad,
  //     precioUnitario: item.producto.precio,
  //     productoId: item.producto.id,
  //     varianteProductoId: item.varianteSeleccionada ? item.varianteSeleccionada.id : null,
  //   }));
  
  //   // Crear el objeto de datos del pedido
  //   const envio: EnvioDTO | null = this.esEnvio ? {
  //     direccion: this.direccionEnvio,
  //     ciudad: this.ciudadEnvio,
  //     provincia: this.provinciaEnvio,
  //     codigoPostal: this.codigoPostal,
  //     fechaEstimada: new Date().toISOString()  // Este valor puede ser calculado o dejado vacío si no es requerido
  //   } : null;
  
  //   const retiro: RetiroDTO | null = !this.esEnvio ? {
  //     puntoRetiro: this.puntoRetiroSeleccionado,
  //     nombreRetira: this.nombreRetira,
  //     documentoRetira: this.documentoRetira,
  //     fechaRetiro: new Date().toISOString()
  //   } : null;
  
  //   const pedido: PedidoCreacionDTO = {
  //     estado: 'Pendiente',
  //     total: this.total,
  //     usuarioId,
  //     metodoPago: this.medioPagoSeleccionado,
  //     detalles,
  //     envio,
  //     retiro,
  //     fechaCreacion: new Date().toISOString(),
  //     fechaActualizacion: new Date().toISOString(),
  //     esEnvio: this.esEnvio,
  //   };
  
  //   // Enviar el pedido a la API
  //   this.procesando = true;
  //   this.pedidoService.crearPedido(pedido).subscribe({
  //     next: (response) => {
  //       console.log('Compra registrada con éxito:', response);
  //       this.carritoService.eliminarCarrito();
  //       this.procesando = false;
  //       alert('Compra confirmada. ¡Gracias por tu pedido!');
  //     },
  //     error: (error) => {
  //       console.error('Error al registrar la compra:', error);
  //       this.procesando = false;
  //       alert('Ocurrió un error al confirmar la compra. Inténtalo nuevamente.');
  //     }
  //   });
  // }

  carrito: Carrito[] = [];
  total: number = 0;
  metodoPago: string = '';
  esEnvio: boolean = false;
  direccionEnvio: string = '';
  puntoRetiro: string = '';
  usuarioId: string = 'usuario123';  // Este valor debería ser dinámico

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    this.carrito = this.carritoService.getCarrito();
    this.total = this.carritoService.total();
  }

  // Crear pedido
  confirmarCompra(): void {
    const detalles = this.carrito.map(item => ({
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      productoId: item.producto.id,
      varianteProductoId: item.varianteSeleccionada?.id
    }));

    const pedido: Pedido = new Pedido(
      0, // Id generado por el backend
      'Pendiente', // Estado inicial
      this.total,
      this.metodoPago,
      new Date(),
      new Date(),
      this.esEnvio,
      this.usuarioId,
      detalles,
      this.esEnvio ? { direccion: this.direccionEnvio, ciudad: '', provincia: '', codigoPostal: '', fechaEstimada: new Date() } : undefined,
      !this.esEnvio ? { puntoRetiro: this.puntoRetiro, nombreRetira: 'Nombre', documentoRetira: '12345678', fechaRetiro: new Date() } : undefined
    );

    this.pedidoService.crearPedido(pedido).subscribe(
      response => {
        console.log('Pedido creado con éxito:', response);
        // Limpiar carrito después de la compra
        this.carritoService.eliminarCarrito();
      },
      error => {
        console.error('Error al crear el pedido:', error);
      }
    );
  }
}
