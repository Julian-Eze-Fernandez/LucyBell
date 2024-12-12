import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appsettings } from '../Settings/appsettings';
import { PedidoCreacionDTO, PedidoDTO } from '../Models/Pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private http = inject(HttpClient);
  private readonly apiUrl = appsettings.apiUrl + "pedidos"

  constructor() {}
  
  crearPedido(pedido: PedidoCreacionDTO): Observable<PedidoDTO> {
  return this.http.post<PedidoDTO>(this.apiUrl, pedido);
  }

  obtenerPedidosPorUsuario(usuarioId: string): Observable<PedidoDTO[]> {
  return this.http.get<PedidoDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  obtenerPedidosActivos(): Observable<PedidoDTO[]> {
  return this.http.get<PedidoDTO[]>(`${this.apiUrl}/pendientes`);
  }

  obtenerPedidosFinalizados(): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(`${this.apiUrl}/finalizados`);
    }

  actualizarEstadoPedido(id: number, estado: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}/estado?nuevoEstado=${estado}`, { estado });
  }

}
