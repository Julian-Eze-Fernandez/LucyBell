import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Categoria } from '../Models/Categoria';
import { ResponseAPI } from '../Models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {


  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiUrl + "categorias";

  constructor() { }

  GetCategoriasLista(){
    return this.http.get<Categoria[]>(this.apiUrl);
  }
  obtener(id:number){
    return this.http.get<Categoria[]>(`${this.apiUrl}/${id}`);
  }
  crear(objeto:Categoria){
    return this.http.post<ResponseAPI>(this.apiUrl,objeto);
  }
  editar(objeto:Categoria){
    return this.http.put<ResponseAPI>(this.apiUrl,objeto);
  }
  DeleteCategoria(id:number){
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
