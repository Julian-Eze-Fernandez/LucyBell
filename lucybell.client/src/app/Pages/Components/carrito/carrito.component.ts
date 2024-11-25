import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CarritoService } from '../../../Services/carrito.service';
import { Carrito } from '../../../Models/Carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  carritoService = inject(CarritoService);
  listCarrito: Carrito[] = [];
  @Input() cartOpen: boolean = false;
  @Output() cartClose: EventEmitter<void> = new EventEmitter();

  mensajeError: string | null = null;

  
  ngOnInit(): void {
    this.getListCarrito();
    this.carritoService.carrito$.subscribe(carrito => {
      this.listCarrito = carrito;
    });
  }

  cerrarCarrito() {
    this.cartClose.emit();
  }

  getListCarrito(){
    this.listCarrito = this.carritoService.getCarrito();
  }

  eliminarItem(index: number) {
    this.carritoService.eliminar(index);
    this.getListCarrito();
  }

  aumentarCantidad(index: number) {
    const item = this.listCarrito[index];
  
    if (item.varianteSeleccionada) {
      const stockDisponible = item.varianteSeleccionada.cantidad;
      if (item.cantidad < stockDisponible) {
        item.cantidad += 1;
        this.actualizarCarrito(item, index);
        this.mensajeError = null; // Limpia el mensaje de error si todo está bien
      } else {
        this.mostrarMensajeError(
          `No hay stock suficiente para agregar esa cantidad al carrito.`
        );
      }
    } else if (item.producto.variantesProducto.length === 1) {
      const varianteUnica = item.producto.variantesProducto[0];
      const stockDisponible = varianteUnica.cantidad;
      if (item.cantidad < stockDisponible) {
        item.cantidad += 1;
        item.varianteSeleccionada = varianteUnica;
        this.actualizarCarrito(item, index);
        this.mensajeError = null; // Limpia el mensaje de error si todo está bien
      } else {
        this.mostrarMensajeError(
          `No hay stock suficiente para agregar esa cantidad al carrito.`
        );
      }
    } else {
      this.mostrarMensajeError("Debes seleccionar una variante antes de aumentar la cantidad.");
    }
  
    this.actualizarTotal();
  }
  
  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
  
    // Oculta el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensajeError = null;
    }, 3000); // 3000 ms = 3 segundos
  }
  

  disminuirCantidad(index: number) {
    if (this.listCarrito[index].cantidad > 1) {  
      this.listCarrito[index].cantidad -= 1;
      this.actualizarCarrito(this.listCarrito[index], index);
    }
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.carritoService.actualizarTotalCarrito();
  }

  actualizarCarrito(item: Carrito , index: number){
    this.carritoService.actualizar(index, item.cantidad);
  }
}
