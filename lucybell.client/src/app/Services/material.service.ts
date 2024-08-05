import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Categoria } from '../Models/Categoria';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';
import { Material, MaterialCreacionDTO } from '../Models/Material';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private http = inject(HttpClient);
  private apiUrl: string = 'https://localhost:7123/api/materiales';

  constructor() { }

  GetMaterialesLista() {
    return this.http.get<Material[]>(this.apiUrl);
  }
  GetMaterialId(id: number) {
    return this.http.get<Material[]>(`${this.apiUrl}/${id}`);
  }
  PostMaterial(objeto: MaterialCreacionDTO) {
    return this.http.post<ResponseAPI>(this.apiUrl, objeto);
  }
  PutMaterial(objeto: Material) {
    return this.http.put<ResponseAPI>(this.apiUrl, objeto);
  }
  DeleteMaterial(id: number) {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
