import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SeguridadService } from '../../Services/seguridad.service';
import { UsuarioDTO } from '../../Pages/seguridad/seguridad';
import { PedidoService } from '../../Services/pedido.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  usuario: UsuarioDTO | null = null;
  usuarioId: string | null = null;
  error: string | null = null;
  pedidos: any[] = [];
  pedidosCompletados: any[] = [];
  pedidosPendientes: any[] = [];
  mensaje: string | null = null;


  constructor(private seguridadService: SeguridadService, private pedidoService: PedidoService, private router: Router) { }

  ngOnInit(): void {
    this.cargarUsuarioActual();
    this.cargarPedidos();
  }

  cargarUsuarioActual(): void {
    this.seguridadService.obtenerUsuarioActual()
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
        error: (err) => {
          this.error = 'No se pudo cargar la información del usuario.';
          console.error(err);
        }
    });
  }

  cargarPedidos(): void {
    this.usuarioId = this.seguridadService.obtenerUsuarioId();
  
    this.pedidoService.obtenerPedidosPorUsuario(this.usuarioId!)
      .subscribe({
        next: (data) => {

          this.pedidosCompletados = data.filter(pedido => 
            pedido.estado === "Pagado" || pedido.estado === "Cancelado"
          );
          this.pedidosPendientes = data.filter(pedido => pedido.estado === "Pendiente");
  
          this.pedidos = data;
  
          console.log('Pedidos completados:', this.pedidosCompletados);
          console.log('Pedidos pendientes:', this.pedidosPendientes);
        },
        error: (err) => {
          this.error = 'No se pudieron cargar los pedidos.';
          console.error(err);
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pendiente':
        return 'badge-primary';
      case 'Pagado':
        return 'badge-success';
      case 'Cancelado':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  }

  volverTienda(): void {
    this.router.navigate(['/']);
  }
  
  enviarCambioContrasena(): void {
    this.seguridadService.solicitarRestablecimientoParaUsuarioActual().subscribe();

    this.mensaje = 'Se ha enviado un enlace para restablecer tu contraseña, este proceso puede tardar unos minutos.';
  }

}

