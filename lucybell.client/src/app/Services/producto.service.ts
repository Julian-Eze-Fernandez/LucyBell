import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Producto, ProductoCreacion } from '../Models/Producto';
import { appsettings } from '../Settings/appsettings';
import { Observable } from 'rxjs'; // agregado por mi

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private readonly apiUrl = appsettings.apiUrl + "productos"

  constructor() { }

  PostProducto(categoriaId: number, subCategoriaId: number | null, materialId: number | null, formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  DeleteProducto(id: number) {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }

  GetProductoCompleto(){
    return this.http.get<Producto[]>(`${this.apiUrl}/completo`)
  }

}
