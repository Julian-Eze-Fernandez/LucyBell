import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { PedidoService } from '../../Services/pedido.service';

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
  pedidoSeleccinadoId: number = -1;
  modalImage: string = '';

  pedidoSeleccinado: any;

  modalTitle: string = '';
  modalMsj: string = '';

  confirmarVenta:boolean = false;

  constructor(private pedidoService: PedidoService) {}


  ngOnInit(): void {
    this.GetPedidosYFiltrados();
  }

  GetPedidosYFiltrados() {
    this.PedidosActivos = [];
    this.PedidosEnvio = [];
    this.PedidosRetiro = [];
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

  openInfoModal(pedido:any): void {
    this.pedidoSeleccinado = pedido;

    console.log(this.pedidoSeleccinado)
  }

  openConfirmarVentaModal(pedido: any): void {
    this.pedidoSeleccinado = pedido;
    this.pedidoSeleccinadoId = pedido.id;

    this.modalMsj = '¿Está seguro de que desea confirmar que esta venta se ha completado con éxito?'
    this.modalTitle = 'Confirmar venta exitosa';
    this.modalImage = '../../../assets/icons/DoneBlack.svg';
    this.confirmarVenta = true
  }

  ventaExitosa(id: number): void {
    this.pedidoService.actualizarEstadoPedido(id, 'Pagado').subscribe({
      next:() => {
        this.GetPedidosYFiltrados();
      }
    })
    this.GetPedidosYFiltrados();
  }

  openCancelarVentaModal(pedido: any): void {
    this.pedidoSeleccinado = pedido;
    this.pedidoSeleccinadoId = pedido.id;
    this.confirmarVenta = false;

    this.modalMsj = '¿Está seguro de que desea cancelar esta venta? El stock sera devuelto al inventario.'
    this.modalTitle = 'Cancelar Venta';
    this.modalImage = '../../../assets/icons/Close.svg';

    console.log(this.pedidoSeleccinado)
  }

  cancelarVenta(id: number): void {
    this.pedidoService.actualizarEstadoPedido(id, 'Cancelado').subscribe({
      next:() => {
        this.GetPedidosYFiltrados();
      }
    })
    this.GetPedidosYFiltrados();
  }
}


