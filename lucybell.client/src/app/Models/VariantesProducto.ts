import { ProductoSinVariantesDTO } from "./Producto";
export interface VariantesProducto {
  id: number;
  color: string;
  cantidad: number;
}

export interface VariantesProductoCreacionDTO {
  color: string | null;
  cantidad: number;
}

export interface VarianteProductoDTO {
  id: number;
  color: string;
  cantidad: number;
}
