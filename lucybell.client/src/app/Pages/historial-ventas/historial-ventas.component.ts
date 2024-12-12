import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { PedidoService } from '../../Services/pedido.service';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule, SidebarAdminComponent],
  templateUrl: './historial-ventas.component.html',
  styleUrl: './historial-ventas.component.css'
})
export class HistorialVentasComponent implements OnInit {

  @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;

  constructor(private pedidoService: PedidoService) { }

  pedidosFinalizados: any[] = [];
  pedidoSeleccionado: any;

  ngOnInit(): void {
    this.GetPedidosFinalizados();
  }

GetPedidosFinalizados() {
  this.pedidosFinalizados = [];
  this.pedidoService.obtenerPedidosFinalizados().subscribe({
      next: (data) => {
          this.pedidosFinalizados = data;
      },
      error: (err) => {
          console.log(err.message);
      }
  });
}

openInfoModal(pedido:any): void {
  this.pedidoSeleccionado = pedido;
}

toggleChildSidebar(): void {
    this.sidebarAdmin.toggleSidebar();
  }
}
