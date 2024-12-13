import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { CredencialesUsuarioDTO, RespuestaAutenticacionDTO, UsuarioDTO } from '../Pages/seguridad/seguridad';
import { Observable, tap } from 'rxjs';
import { PaginacionDTO } from '../Pages/seguridad/compartidos/modelos/PaginacionDTO';
import { construirQueryParams } from '../Pages/seguridad/compartidos/funciones/construirQueryParams';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = appsettings.apiUrl.endsWith('/') ? appsettings.apiUrl + 'usuarios' : appsettings.apiUrl + '/usuarios';
  private readonly llaveToken = 'token';
  private readonly llaveExpiracion = 'token-expiracion';

  obtenerUsuariosPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<UsuarioDTO[]>> {
    let queryParams = construirQueryParams(paginacion);
    return this.http.get<UsuarioDTO[]>(`${this.urlBase}/ListadoUsuarios`, { params: queryParams, observe: 'response' });
  }

  obtenerUsuarioActual(): Observable<UsuarioDTO> {
    const token = this.obtenerToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación.');
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get<UsuarioDTO>(`${this.urlBase}/me`, { headers });
  }

  obtenerCantidadUsuarios(): Observable<number> {
    return this.http.get<number>(`${this.urlBase}/CantidadUsuarios`);
  }

  hacerAdmin(email: string){
    return this.http.post(`${this.urlBase}/haceradmin`, {email});
  }
  
  removerAdmin(email: string){
    return this.http.post(`${this.urlBase}/removeradmin`, {email});
  }

  // registrar(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO>{
  //   return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/registrar`, credenciales)
  //   .pipe(
  //     tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
  //   )
  // }

  registrar(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/registrar`, credenciales)
      .pipe(
        tap(respuestaAutenticacion => {
          // No se guarda el token aquí, se omite guardar el token
        })
      );
  }
  

  login(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO>{
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/login`, credenciales)
    .pipe(
      tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
    )
  }

  guardarToken(respuestaAutenticacionDTO: RespuestaAutenticacionDTO){
    localStorage.setItem(this.llaveToken, respuestaAutenticacionDTO.token);
    localStorage.setItem(this.llaveExpiracion, respuestaAutenticacionDTO.expiracion.toString());
  }

  logout(){
    localStorage.removeItem(this.llaveToken);
    localStorage.removeItem(this.llaveExpiracion);
    localStorage.removeItem('carrito'); 

    window.location.reload();
  }

  obtenerRol(): string {
    const esAdmin = this.obtenerCampoJWT('esadmin');
    if (esAdmin) {
      return 'admin'
    } else {
    return 'admin';
    }
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.llaveToken);
  }

  decodificarToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  obtenerCampoJWT(campo: string): string {
    const token = this.obtenerToken();
    if (!token) {
      return '';
    }
    const dataToken = this.decodificarToken(token);
    return dataToken[campo];
  }

  obtenerUsuarioId(): string {
    return this.obtenerCampoJWT("sub");
  }

  estaLogueado(): boolean {
    const token = this.obtenerToken();

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

  restablecerContrasena(data: { email: string; token: string; nuevaContrasena: string }): Observable<string> {
    return this.http.post<string>(`${this.urlBase}/restablecer-contrasena`, data, { responseType: 'text' as 'json' });
  }

  solicitarRestablecimientoContrasena(email: string): Observable<any> {
    return this.http.post(`${this.urlBase}/solicitar-restablecimiento-contrasena`, { email });
  }

  solicitarRestablecimientoParaUsuarioActual(): Observable<any> {
    const email = this.obtenerCampoJWT('email');
    if (!email) {
      throw new Error('No se pudo obtener el email del usuario logueado.');
    }
    return this.http.post(`${this.urlBase}/solicitar-restablecimiento-contrasena`, { email });
  }
}
