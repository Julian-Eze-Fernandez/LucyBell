import { Producto } from "./Producto";

export class Carrito {
    producto: Producto;
    cantidad: number;

    constructor(producto: Producto , cantidad: number = 1){
        this.producto = producto;
        this.cantidad = cantidad;
    }
}