import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navBarComponent } from '../Components/navBar/navBar.component';
import { NavBarResponsiveComponent } from '../Components/nav-bar-responsive/nav-bar-responsive.component';
import { ProductoService } from '../../Services/producto.service';
import { appsettings } from '../../Settings/appsettings';
import { ListaProductosComponent } from '../Components/lista-productos/lista-productos.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, navBarComponent, NavBarResponsiveComponent, ListaProductosComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit  {

  constructor( private productoService: ProductoService) {}
  
  isLargeScreen: boolean = true;
  appsettings = appsettings;

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
