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
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }
  PostCategoria(formData: FormData){
    return this.http.post<ResponseAPI>(this.apiUrl, formData);
  }

  putCategoria(id: number, formData: FormData) {
    return this.http.put<ResponseAPI>(`${this.apiUrl}/${id}`, formData);
  }

  DeleteCategoria(id: number){
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
