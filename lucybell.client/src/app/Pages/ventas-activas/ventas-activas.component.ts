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
  pedidoSeleccinadoId: number = 0;

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

  confirmarVenta(id: number, nombre:string): void {
    this.pedidoSeleccinadoId = id;
    this.pedidoSeleccinadoNombre = nombre;

  }

  cancelarVenta(id: number): void {
    console.log('Cancelar venta:', id);
    // Implementar lógica de cancelación
  }

}


