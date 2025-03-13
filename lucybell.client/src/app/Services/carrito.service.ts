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

  agregar(
    producto: Producto,
    cantidad: number = 1,
    varianteSeleccionada?: VariantesProducto
  ): boolean {
    this.obtenerSesion();
  
    if (!varianteSeleccionada && producto.variantesProducto.length === 1) {
      varianteSeleccionada = producto.variantesProducto[0];
    }
  
    const index = this.listCarrito.findIndex(
      (item) =>
        item.producto.id === producto.id &&
        (!varianteSeleccionada || item.varianteSeleccionada?.id === varianteSeleccionada.id)
    );
  
    const stockDisponible = varianteSeleccionada?.cantidad ?? 0;
  
    if (index === -1) {
      if (cantidad > stockDisponible) {
        return false;
      }
      const item = new Carrito(producto, cantidad, varianteSeleccionada);
      this.listCarrito.push(item);
    } else {
      const nuevoTotal = this.listCarrito[index].cantidad + cantidad;
      if (nuevoTotal > stockDisponible) {
        return false;
      }
      this.actualizar(index, nuevoTotal);
    }
  
    this.guardarSesion();
    this.carritoSubject.next(this.listCarrito);
  
    return true; // Operación exitosa
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

  eliminarCarrito() {
    this.listCarrito = [];
    this.guardarSesion();
    this.carritoSubject.next(this.listCarrito);
  }
}
