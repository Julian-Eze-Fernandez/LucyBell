export interface VariantesProducto {
  id: number;
  color: string;
  cantidad: number;
}

export interface VariantesProductoCreacionDTO {
  color: string | null;
  cantidad: number;
}

export interface ProductoSinVariantesDTO {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
}

export interface VarianteProductoDTO {
  id: number;
  color: string;
  cantidad: number;
  productoSinVariante: ProductoSinVariantesDTO;
}
