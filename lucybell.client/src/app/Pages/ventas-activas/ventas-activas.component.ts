import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { AdministrarProductosComponent } from "../administrar-productos/administrar-productos.component";

interface Sale {
  id: number;
  nombre: string;
  fecha: string;
  metodo: string;
  envio: string;
  total: number;
  estado: string;
}

@Component({
  selector: 'app-ventas-activas',
  standalone: true,
  imports: [CommonModule, SidebarAdminComponent],
  templateUrl: './ventas-activas.component.html',
  styleUrl: './ventas-activas.component.css'
})
export class VentasActivasComponent {

  sales: Sale[] = [
    {
      id: 1,
      nombre: 'Ana Vázquez Olmos',
      fecha: '10/05/24',
      metodo: 'Transferencia',
      envio: 'En proceso',
      total: 8000.00,
      estado: 'pendiente'
    },
    {
      id: 2,
      nombre: 'Dergazarian Thomas',
      fecha: '12/05/24',
      metodo: 'Transferencia',
      envio: 'Pendiente',
      total: 12000.00,
      estado: 'pendiente'
    },
    {
      id: 3,
      nombre: 'Rocío Martina García',
      fecha: '13/05/24',
      metodo: 'Retiro',
      envio: 'Patio Olmos',
      total: 6000.00,
      estado: 'pendiente'
    },
    {
      id: 4,
      nombre: 'Agustina Lara Bustos',
      fecha: '13/05/24',
      metodo: 'Transferencia',
      envio: 'Recibido',
      total: 9000.00,
      estado: 'pendiente'
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


