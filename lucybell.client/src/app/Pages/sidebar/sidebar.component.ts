import { Component, OnInit } from '@angular/core';
import { AutorizadoComponent } from "../seguridad/autorizado/autorizado.component";
import { CategoriaService } from '../../Services/categoria.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AutorizadoComponent
]
})

export class SidebarComponent implements OnInit {

  isSidebarOpen = false;
  categorias: any[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.GetCategorias()
  }

  GetCategorias() {
    this.categoriaService.GetCategoriasLista().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
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