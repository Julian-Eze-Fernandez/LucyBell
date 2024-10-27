import {ImagenProductoDTO} from "../Models/ImagenProducto"
import {VariantesProducto} from "../Models/VariantesProducto"
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  destacado: boolean;
  categoriaId: number;
  categoriaNombre: string;
  subCategoriaId: number;
  materialId: number;
  imagenesProductos: ImagenProductoDTO[];
  variantesProducto: VariantesProducto[];
  
}

export interface PaginatedProductos {
  productos: Producto[];
  totalCount: number;
  totalPages: number;
}

export interface ProductoCreacion {
  nombre: string;
  precio: number;
  destacado: boolean;
  descripcion?: string;
}

export interface ProductoSinVariantesDTO {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
}
