import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Producto, ProductoCreacion } from '../Models/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private apiUrl: string = 'https://localhost:7123/api';

  constructor() { }

  PostProducto(categoriaId: number, subCategoriaId: number, materialId: number, objeto: ProductoCreacion) {
    const url = `${this.apiUrl}/${categoriaId}/${subCategoriaId}/${materialId}/productos`;
    return this.http.post<ResponseAPI>(url, objeto);
  }
}
