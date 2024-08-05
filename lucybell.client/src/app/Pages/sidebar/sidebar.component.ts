import { Component, OnInit } from '@angular/core';
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
  ]
})
export class SidebarComponent implements OnInit {

  isSidebarOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    const sidebar = document.getElementById('default-sidebar');
    if(sidebar) {
      if (this.isSidebarOpen) {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
      } else {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
      }
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  toggleDropdown(dropdownId: string): void {
    const dropdown = document.getElementById(dropdownId);
    if(dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }
}

