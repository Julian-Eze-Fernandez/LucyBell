import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Producto, PaginatedProductos } from '../Models/Producto';
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

  GetProductoById(id: number){
    return this.http.get<Producto>(`${this.apiUrl}/${id}`)
  }

  GetFilteredProducts(
    categoriaId?: number | null,
    subCategoriaId?: number | null,
    materialId?: number | null,
    page: number = 1,
    pageSize: number = 10
  ): Observable<HttpResponse<Producto[]>> {  // Explicitly set return type
    let params = new HttpParams();
    if (categoriaId) params = params.append('categoriaId', categoriaId.toString());
    if (subCategoriaId) params = params.append('subCategoriaId', subCategoriaId.toString());
    if (materialId) params = params.append('materialId', materialId.toString());
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
  
    // Return full HTTP response
    return this.http.get<Producto[]>(`${this.apiUrl}/filtrado`, { params, observe: 'response' });
  }

  PutProducto(id: number, categoriaId: number, subCategoriaId: number | null, materialId: number | null, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }


}
