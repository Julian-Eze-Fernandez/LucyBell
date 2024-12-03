import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { AdministrarProductosComponent } from "../administrar-productos/administrar-productos.component";

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
export class VentasActivasComponent {

  @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;

  toggleChildSidebar(): void {
    this.sidebarAdmin.toggleSidebar();
  }

  sales: Sale[] = [
    {
      id: 1,
      nombre: 'Ana Vázquez Olmos',
      fecha: '10/05/24',
      ubicacion: 'Patio Olmos',
      entrega: '14/05/24 19:00',
      total: 8000.00,
    },
    {
      id: 2,
      nombre: 'Dergazarian Thomas',
      fecha: '12/05/24',
      ubicacion: 'Barrio Talleres',
      entrega: '14/05/24 20:00',
      total: 12000.00,
    },
    {
      id: 3,
      nombre: 'Rocío Martina García',
      fecha: '13/05/24',
      ubicacion: 'Patio Olmos',
      entrega: '18/05/24 21:00',
      total: 6000.00,
    },
    {
      id: 4,
      nombre: 'Agustina Lara Bustos',
      fecha: '13/05/24',
      ubicacion: 'Barrio Talleres',
      entrega: '16/05/24 20:00',
      total: 9000.00,
    }
  ];

  sales2: Sale2[] = [
    {
      id: 1,
      nombre: 'Ana Vázquez Olmos',
      fecha: '10/05/24',
      envio: 'En proceso',
      intentos: 0,
      total: 8000.00,
    },
    {
      id: 2,
      nombre: 'Dergazarian Thomas',
      fecha: '12/05/24',
      envio: 'Pendiente',
      intentos: 1,
      total: 12000.00,
    },
    {
      id: 3,
      nombre: 'Rocío Martina García',
      fecha: '13/05/24',
      envio: 'Patio Olmos',
      intentos: 0,
      total: 6000.00,
    },
    {
      id: 4,
      nombre: 'Agustina Lara Bustos',
      fecha: '13/05/24',
      envio: 'Recibido',
      intentos: 2,
      total: 9000.00,
    }
  ];

  verDetalles(id: number): void {
    console.log('Ver detalles de la venta:', id);
    // Implementar lógica para mostrar detalles
  }

  confirmarVenta(id: number): void {
    console.log('Confirmar venta:', id);
    // Implementar lógica de confirmación
  }

  cancelarVenta(id: number): void {
    console.log('Cancelar venta:', id);
    // Implementar lógica de cancelación
  }

}


