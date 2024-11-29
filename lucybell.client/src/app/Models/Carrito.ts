import { Producto } from "./Producto";
import { VariantesProducto } from "./VariantesProducto";

export class Carrito {
    producto: Producto;
    cantidad: number;
    varianteSeleccionada?: VariantesProducto;

    constructor(producto: Producto , cantidad: number = 1, varianteSeleccionada?: VariantesProducto){
        this.producto = producto;
        this.cantidad = cantidad;
        this.varianteSeleccionada = varianteSeleccionada;
    }
}