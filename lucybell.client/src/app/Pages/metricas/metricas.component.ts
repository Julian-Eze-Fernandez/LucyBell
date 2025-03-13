import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { PedidoService } from '../../Services/pedido.service';
import { SeguridadService } from '../../Services/seguridad.service';

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule,SidebarAdminComponent],
  templateUrl: './metricas.component.html',
  styleUrl: './metricas.component.css'
})
export class MetricasComponent implements OnInit {

  @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;

  constructor (private pedidoService: PedidoService, private seguridadService: SeguridadService) { }

  ngOnInit(): void {
    this.cargarMetricas();
  }

  pedidosActivos: number = 0;
  envios: number = 0;
  retiros: number = 0;
  clientes: number = 0;

  cargarMetricas(): void {
    this.pedidoService.obtenerPedidosActivos().subscribe(
      (data) => {
        this.pedidosActivos = data.length; 
        this.envios = data.filter(pedido => pedido.esEnvio === true).length; 
        this.retiros = data.filter(pedido => pedido.esEnvio === false).length; 
      },
      (err) => {
        console.error('Error loading active orders:', err);
      }
    );

    this.seguridadService.obtenerCantidadUsuarios().subscribe(
      (data) => {
        this.clientes = data;
      },
      (err) => {
        console.error('Error loading clients:', err);
      }
    );
  }

  toggleChildSidebar(): void {
    this.sidebarAdmin.toggleSidebar();
  }

  
}
