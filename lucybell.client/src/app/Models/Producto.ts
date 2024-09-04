import {ImagenProductoDTO} from "../Models/ImagenProducto"
import {VariantesProducto} from "../Models/VariantesProducto"
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoriaId: number;
  subCategoriaId: number;
  materialId: number;
  imagenesProductos: ImagenProductoDTO[];
  variantesProducto: VariantesProducto[];
}

export interface ProductoCreacion {
  nombre: string;
  precio: number;
  descripcion?: string;
}

export interface ProductoSinVariantesDTO {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
}
