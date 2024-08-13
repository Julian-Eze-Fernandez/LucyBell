export interface SubCategoria {
  id: number;
  nombre: string;
  categoriaId: number;

}

export interface SubCategoriaCreacionDTO {
  nombre: string;
  categoriaId: number;
}
