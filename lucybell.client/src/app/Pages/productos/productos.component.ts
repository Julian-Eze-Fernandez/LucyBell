import { Component, OnInit, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navBarComponent } from '../navBar/navBar.component';
import { SeguridadService } from '../../Services/seguridad.service';
import { AutorizadoComponent } from '../seguridad/autorizado/autorizado.component';
import { NavBarResponsiveComponent } from '../nav-bar-responsive/nav-bar-responsive.component';
import { ProductoService } from '../../Services/producto.service';
import { Producto } from '../../Models/Producto';
import { appsettings } from '../../Settings/appsettings';
import { CarritoService } from '../../Services/carrito.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, navBarComponent, AutorizadoComponent, NavBarResponsiveComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit  {

  constructor( private productoService: ProductoService) {}
  private carritoService = inject(CarritoService);
  isLargeScreen: boolean = true;
  productos: Producto[] = [];
  appsettings = appsettings;

  ngOnInit(): void {
    this.checkScreenSize();
    this.cargarProductos(); 
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }

  cargarProductos(): void {
    this.productoService.GetProductoCompleto().subscribe((data: Producto[]) => {
      this.productos = data;
    });
  }

  agregarProducto(item: Producto){
    this.carritoService.agregar(item);
  }


}
