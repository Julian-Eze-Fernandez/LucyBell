import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { CredencialesUsuarioDTO, RespuestaAutenticacionDTO } from '../Pages/seguridad/seguridad';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = appsettings.apiUrl.endsWith('/') ? appsettings.apiUrl + 'usuarios' : appsettings.apiUrl + '/usuarios';
  private readonly llaveToken = 'token';
  private readonly llaveExpiracion = 'token-expiracion';
  
  registrar(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO>{
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/registrar`, credenciales)
    .pipe(
      tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
    )
  }

  login(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO>{
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/login`, credenciales)
    .pipe(
      tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
    )
  }

  obtenerCampoJWT(campo: string): string {
    const token = localStorage.getItem(this.llaveToken);
    if (!token) {return ''}
    var dataToken = JSON.parse(atob(token.split('.')[1]))
    return dataToken[campo];
  }

  guardarToken(respuestaAutenticacionDTO: RespuestaAutenticacionDTO){
    localStorage.setItem(this.llaveToken, respuestaAutenticacionDTO.token);
    localStorage.setItem(this.llaveExpiracion, respuestaAutenticacionDTO.expiracion.toString());
  }

  estaLogueado(): boolean {

    const token = localStorage.getItem(this.llaveToken)

    if (!token) {
      return false;
    }

    const expiracion = localStorage.getItem(this.llaveExpiracion)!;
    const expiracionFecha = new Date(expiracion);

    if (expiracionFecha <= new Date()) {
      this.logout();
      return false;
    }

    return true;
  }

  logout(){
    localStorage.removeItem(this.llaveToken);
    localStorage.removeItem(this.llaveExpiracion);
  }


  obtenerRol(): string {
    return '';
  }
}
