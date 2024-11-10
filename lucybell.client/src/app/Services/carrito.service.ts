import { Injectable } from '@angular/core';
import { Carrito } from '../Models/Carrito';
import { Producto } from '../Models/Producto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private listCarrito: Carrito[] = [];
  private carritoSubject = new BehaviorSubject<Carrito[]>([]);
  
  carrito$ = this.carritoSubject.asObservable();

  constructor() {
    this.obtenerSesion();
    this.carritoSubject.next(this.listCarrito);
  }

  getCarrito(){
    this.obtenerSesion();
    return this.listCarrito;
  }

  agregar(producto: Producto , cantidad: number = 1){
    this.obtenerSesion();
    const index = this.listCarrito.findIndex(item => item.producto.id == producto.id);

    if (index == -1){
      const item = new Carrito(producto , cantidad);
      this.listCarrito.push(item);
    }else{
      this.actualizar(index , this.listCarrito[index].cantidad + cantidad);
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
