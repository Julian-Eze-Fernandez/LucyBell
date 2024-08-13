import { SubCategoria } from "./SubCategoria";

export interface Categoria{
  id : number;
  nombre: string;
  subCategorias: SubCategoria[];
}
export interface CategoriaABM {
  id: number;
  nombre: string;
}

export interface CategoriaCreacionDTO {
  nombre: string;
}

export interface CategoriaGetSubCategorias {
  id: number;
  nombre: string;
  isExpanded: boolean;
  subCategorias: SubCategoria[];
}
