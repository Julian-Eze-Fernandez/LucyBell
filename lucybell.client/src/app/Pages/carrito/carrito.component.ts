import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CarritoService } from '../../Services/carrito.service';
import { Carrito } from '../../Models/Carrito';

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
  
  
  ngOnInit(): void {
    this.getListCarrito();
    this.carritoService.carrito$.subscribe(carrito => {
      this.listCarrito = carrito;
    });
  }

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  getListCarrito(){
    this.listCarrito = this.carritoService.getCarrito();
  }

  eliminarItem(index: number) {
    this.carritoService.eliminar(index);
    this.getListCarrito();
  }

   aumentarCantidad(index: number) {
    if (this.listCarrito[index].cantidad < 99) {  
      this.listCarrito[index].cantidad += 1;
      this.actualizarCarrito(this.listCarrito[index], index);
    }
    this.actualizarTotal();
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
