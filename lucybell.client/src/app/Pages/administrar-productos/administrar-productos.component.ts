import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProductoService } from '../../Services/producto.service'
import { CategoriaService } from '../../Services/categoria.service'
import {Producto} from '../../Models/Producto'

@Component({
  selector: 'app-administrar-productos',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './administrar-productos.component.html',
  styleUrl: './administrar-productos.component.css'
})
export class AdministrarProductosComponent implements OnInit {

  productos: Producto[] = [];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.productoService.GetProductoCompleto().subscribe((data: Producto[]) => {
      this.productos = data;
      console.log(this.productos);
      console.log(this.productos[0].imagenesProductos[0].urlImagen);
      
    });
  }

  getTotalStock(producto: Producto): number {
    return producto.variantesProducto.reduce((acc, variante) => acc + variante.cantidad, 0);
  }
}
