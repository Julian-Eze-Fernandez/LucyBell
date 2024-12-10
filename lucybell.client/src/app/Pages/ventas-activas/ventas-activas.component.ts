import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { AdministrarProductosComponent } from "../administrar-productos/administrar-productos.component";
import { PedidoService } from '../../Services/pedido.service';

interface Sale {
  id: number;
  nombre: string;
  fecha: string;
  ubicacion: string;
  entrega: string;
  total: number;
}

interface Sale2 {
  id: number;
  nombre: string;
  fecha: string;
  envio: string;
  intentos: number;
  total: number;
}

@Component({
  selector: 'app-ventas-activas',
  standalone: true,
  imports: [CommonModule, SidebarAdminComponent],
  templateUrl: './ventas-activas.component.html',
  styleUrl: './ventas-activas.component.css'
})
export class VentasActivasComponent implements OnInit {

  @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;

  PedidosActivos: any[] = []; // This is the array fetched from the service
  PedidosEnvio: any[] = [];
  PedidosRetiro: any[] = [];
  pedidoSeleccinadoNombre: string = '';
  pedidoSeleccinadoId: number = -1;

  modalMsj: string = '';

  confirmarVenta:boolean = false;

  constructor(private pedidoService: PedidoService) {}


  ngOnInit(): void {
    this.GetPedidosYFiltrados();

  }

  GetPedidosYFiltrados() {
    this.pedidoService.obtenerPedidosActivos().subscribe({
      next: (data) => {
        this.PedidosActivos=data;
        for (const obj of this.PedidosActivos) {
          if (obj.esEnvio) {
            this.PedidosEnvio.push(obj);
          } else {
            this.PedidosRetiro.push(obj);
          }
        }
        console.log(this.PedidosActivos)
      },
      error: (err) => {
        console.log(err.message);
      }
    })
  }

  toggleChildSidebar(): void {
    this.sidebarAdmin.toggleSidebar();
  }

  verDetalles(id: number): void {
    console.log('Ver detalles de la venta:', id);
    // Implementar lógica para mostrar detalles
  }

  openConfirmarVentaModal(pedido: any): void {
    this.pedidoSeleccinadoId = pedido.id;
    this.pedidoSeleccinadoNombre = pedido.usuario.nombre;

    this.modalMsj = '¿Está seguro de que desea confirmar que esta venta se ha completado con éxito?'
    this.confirmarVenta = true
  }

  ventaExitosa(id: number): void {
    this.pedidoService.actualizarEstadoPedido(id, 'Pagado').subscribe()
  }

  openCancelarVentaModal(pedido: any): void {
    this.pedidoSeleccinadoId = pedido.id;
    this.pedidoSeleccinadoNombre = pedido.usuario.nombre;
    this.confirmarVenta = false;

    this.modalMsj = '¿Está seguro de que desea cancelar esta venta? El stock sera devuelto al inventario.'
  }

  cancelarVenta(id: number): void {
    this.pedidoService.actualizarEstadoPedido(id, 'Cancelado').subscribe()
  }


}


