import { Injectable } from '@angular/core';
import { Carrito } from '../Models/Carrito';
import { Producto } from '../Models/Producto';
import { BehaviorSubject } from 'rxjs';
import { VariantesProducto } from '../Models/VariantesProducto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private listCarrito: Carrito[] = [];
  private carritoSubject = new BehaviorSubject<Carrito[]>([]);
  private advertenciaSubject = new BehaviorSubject<string | null>(null);
  
  carrito$ = this.carritoSubject.asObservable();
  advertencia$ = this.advertenciaSubject.asObservable();

  constructor() {
    this.obtenerSesion();
    this.carritoSubject.next(this.listCarrito);
  }

  getCarrito(){
    this.obtenerSesion();
    return this.listCarrito;
  }

  agregar(producto: Producto, cantidad: number = 1, varianteSeleccionada?: VariantesProducto) {
    this.obtenerSesion();
  
    // Si no se seleccionó una variante, pero el producto tiene una única variante
    if (!varianteSeleccionada && producto.variantesProducto.length === 1) {
      varianteSeleccionada = producto.variantesProducto[0]; // Asignar la variante única
    }
  
    const index = this.listCarrito.findIndex(
      (item) =>
        item.producto.id === producto.id &&
        (!varianteSeleccionada || item.varianteSeleccionada?.id === varianteSeleccionada.id)
    );
  
    if (index === -1) {
      // Si es un producto nuevo en el carrito
      const stockDisponible = varianteSeleccionada?.cantidad ?? 0;
  
      if (cantidad > stockDisponible) {
        alert(`No puedes agregar más. Stock disponible: ${stockDisponible}`);
        return; // Cancela la operación si no hay suficiente stock
      }
      const item = new Carrito(producto, cantidad, varianteSeleccionada);
      this.listCarrito.push(item);
    } else {
      // Si el producto ya está en el carrito, actualizar la cantidad
      const stockDisponible = varianteSeleccionada?.cantidad ?? 0;
      const nuevoTotal = this.listCarrito[index].cantidad + cantidad;
  
      if (nuevoTotal > stockDisponible) {
        alert(`No puedes agregar más. Stock disponible: ${stockDisponible}`);
        return; // Cancela la operación si se supera el stock
      }
      this.actualizar(index, nuevoTotal);
    }
  
    this.guardarSesion();
    this.carritoSubject.next(this.listCarrito);
  }

  actualizar(index: number , cantidad: number){
    if (index >=0 && index < this.listCarrito.length){
      this.listCarrito[index].cantidad = cantidad;
      this.guardarSesion();
      this.carritoSubject.next(this.listCarrito);
    }
  }

  cantidad(){
    this.obtenerSesion();
    return this.listCarrito.length;
  }
  
  total(){
    const total = this.listCarrito.reduce((sum , item) => sum + item.producto.precio * item.cantidad , 0);
    return total;
  }

  eliminar(index: number){
    if (index >=0 && index < this.listCarrito.length){
      this.listCarrito.splice(index , 1);
      this.guardarSesion();
      this.carritoSubject.next(this.listCarrito);
    }
  }

  actualizarTotalCarrito() {
    return this.listCarrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  }

  guardarSesion(){
    localStorage.setItem('carrito' , JSON.stringify(this.listCarrito));
  }

  obtenerSesion(){
    this.listCarrito = [];

    if (typeof window != 'undefined' && window.localStorage) {
      const carrito = localStorage.getItem('carrito');
      if (carrito != null) {
        this.listCarrito = JSON.parse(carrito);
      }      
    }
  }
}
