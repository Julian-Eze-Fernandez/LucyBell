import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AutorizadoComponent } from "../seguridad/autorizado/autorizado.component";

@Component({
  selector: 'app-sidebarAdmin',
  templateUrl: './sidebarAdmin.component.html',
  styleUrl: './sidebarAdmin.component.css',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AutorizadoComponent
]
})
export class SidebarAdminComponent implements OnInit {

  isSidebarOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  dropdownStates: { [key: string]: boolean } = {};


  isDropdownOpen(key: string): boolean {
    return this.dropdownStates[key];
  }


  toggleSidebar(): void {
    const sidebar = document.getElementById('default-sidebar');
    const backdrop = document.getElementById('backdrop');
    if (sidebar && backdrop) {
      if (this.isSidebarOpen) {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        backdrop.classList.add('hidden');
      } else {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        backdrop.classList.remove('hidden');
      }
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  toggleDropdown(dropdownId: string): void {
    const dropdown = document.getElementById(dropdownId);

    this.dropdownStates[dropdownId] = !this.dropdownStates[dropdownId];
  }

}



