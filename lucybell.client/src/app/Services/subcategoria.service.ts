import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SubCategoria, SubCategoriaCreacionDTO } from '../Models/SubCategoria';
import { ResponseAPI } from '../Models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {

  private http = inject(HttpClient);
  private apiUrl: string = 'https://localhost:7123/api/categorias';
  constructor() { }

  GetSubCategoriasLista() {
    return this.http.get<SubCategoria[]>(`${this.apiUrl}/subcategorias/lista`);
  }

  obtenerSubCategoriasPorCategoria(categoriaId: number){
    return this.http.get<SubCategoria[]>(`${this.apiUrl}/${categoriaId}/subcategorias`);
  }

  obtenerSubCategoriaPorId(id: number) {
    return this.http.get(`https://localhost:7123/api/subcategoria/${id}/productos`);
  }

  PostSubCategoria(categoriaId: number, subCategoria: SubCategoriaCreacionDTO) {
    return this.http.post<ResponseAPI>(`${this.apiUrl}/${categoriaId}/subcategorias`, subCategoria);
  }

  PutSubCategoria(categoriaId: number, id: number, subCategoria: SubCategoriaCreacionDTO) {
    return this.http.put<ResponseAPI>(`${this.apiUrl}/${categoriaId}/subcategorias/${id}`, subCategoria);
  }

  DeleteSubCategoria(categoriaId: number, id: number ) {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${categoriaId}/subcategorias/${id}`);
  }
}
