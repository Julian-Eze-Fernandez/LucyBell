import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Categoria, CategoriaCreacionDTO } from '../Models/Categoria';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {


  private http = inject(HttpClient);
  private apiUrl: string = 'https://localhost:7123/api/categorias';

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

  updateCategoria(id: number, categoria: CategoriaCreacionDTO) {
    return this.http.put<ResponseAPI>(`${this.apiUrl}/${id}`, categoria);
  }

  DeleteCategoria(id: number){
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
