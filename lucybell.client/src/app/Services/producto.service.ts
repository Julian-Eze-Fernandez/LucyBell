import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Producto, ProductoCreacion } from '../Models/Producto';
import { Observable } from 'rxjs'; // agregado por mi

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private apiUrl: string = 'https://localhost:7123/api';
    baseUrl: any; //agregado por mi

  constructor() { }

  //PostProducto(categoriaId: number, subCategoriaId: number, materialId: number, objeto: ProductoCreacion) {
  //  const url = `${this.apiUrl}/${categoriaId}/${subCategoriaId}/${materialId}/productos`;
  //  return this.http.post<ResponseAPI>(url, objeto);
  //}

  PostProducto(categoriaId: number = 0, subCategoriaId: number = 0, materialId: number = 0, formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/${categoriaId}/${subCategoriaId}/${materialId}/productos`;
    return this.http.post(url, formData);
  }



}
