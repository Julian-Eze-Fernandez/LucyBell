import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appsettings } from '../Settings/appsettings';
import { Pedido } from '../Models/Pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private http = inject(HttpClient);
  private readonly apiUrl = appsettings.apiUrl + "pedidos"

  constructor() {}
  
  // crearPedido(pedido: PedidoCreacionDTO): Observable<PedidoDTO> {
  // return this.http.post<PedidoDTO>(this.apiUrl, pedido);
  // }

  // obtenerPedidos(usuarioId: string): Observable<PedidoDTO[]> {
  // return this.http.get<PedidoDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  // }

  // actualizarEstadoPedido(id: number, estado: string): Observable<void> {
  // return this.http.put<void>(`${this.apiUrl}/${id}/estado`, { estado });
  // }

   // Crear un nuevo pedido
   crearPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  // Obtener los pedidos de un usuario
  obtenerPedidosUsuario(usuarioId: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  // Obtener un pedido por ID
  obtenerPedidoPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  // Actualizar el estado de un pedido
  actualizarEstadoPedido(id: number, nuevoEstado: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/estado`, nuevoEstado);
  }
}
