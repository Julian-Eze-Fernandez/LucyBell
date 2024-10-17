import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navBarComponent } from '../navBar/navBar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, navBarComponent, SidebarComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  
  isLargeScreen: boolean = true;
  

  ngOnInit(): void {
    this.checkScreenSize(); 
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }

}
