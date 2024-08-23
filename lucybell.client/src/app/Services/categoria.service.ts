import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Categoria, CategoriaCreacionDTO } from '../Models/Categoria';
import { ResponseAPI } from '../Models/ResponseAPI';
import { appsettings } from '../Settings/appsettings'

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly apiUrl = appsettings.apiUrl + "categorias";

  private http = inject(HttpClient);

  constructor() { }

  GetCategoriasLista(){
    return this.http.get<Categoria[]>(this.apiUrl);
  }
  obtener(id:number){
    return this.http.get<Categoria[]>(`${this.apiUrl}/${id}`);
  }
  PostCategoria(objeto: CategoriaCreacionDTO){
    return this.http.post<ResponseAPI>(this.apiUrl,objeto);
  }

  putCategoria(id: number, categoria: CategoriaCreacionDTO) {
    return this.http.put<ResponseAPI>(`${this.apiUrl}/${id}`, categoria);
  }

  DeleteCategoria(id: number){
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
