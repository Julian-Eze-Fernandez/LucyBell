import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule,SidebarAdminComponent],
  templateUrl: './metricas.component.html',
  styleUrl: './metricas.component.css'
})
export class MetricasComponent {

  @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;

  toggleChildSidebar(): void {
    this.sidebarAdmin.toggleSidebar();
  }
}
