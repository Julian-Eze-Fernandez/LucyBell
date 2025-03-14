import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAPI } from '../Models/ResponseAPI';
import { appsettings } from '../Settings/appsettings';
import { VariantesProductoCreacionDTO, VarianteProductoDTO } from '../Models/VariantesProducto';

@Injectable({
  providedIn: 'root'
})
export class VariantesProductoService {

  private http = inject(HttpClient);
  private readonly apiUrl = appsettings.apiUrl + "variantesProductos";

  constructor() { }

  postVariantesProductos(id: number, variantes: VariantesProductoCreacionDTO[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, variantes);
  }
  deleteVariantesProducto(id: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
  GetVariantesConProductos(){
    return this.http.get<VarianteProductoDTO[]>(`${this.apiUrl}`);
  }

  PutVariantesProductos(productoId: number, id: number, variantes: VariantesProductoCreacionDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productoId}/${id}`, variantes);
  }
}
