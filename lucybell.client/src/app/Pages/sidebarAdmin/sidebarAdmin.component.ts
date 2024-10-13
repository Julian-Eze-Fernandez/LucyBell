import { Component, OnInit, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
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

  private startX: number = 0;

  private endX: number = 0;

  isDropdownOpen(key: string): boolean {
    return this.dropdownStates[key];
  }

  private touchStartX: number | null = null;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX !== null) {
      const touchEndX = event.changedTouches[0].clientX;
      const deltaX = touchEndX - this.touchStartX;

      if (deltaX > 50) { // Swipe right to open
        this.toggleSidebar();
      } else if (deltaX < -50) { // Swipe left to close
        this.toggleSidebar();
      }
      this.touchStartX = null;
    }
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



