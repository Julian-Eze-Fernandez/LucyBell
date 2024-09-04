import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProductoService } from '../../Services/producto.service'
import { CategoriaService } from '../../Services/categoria.service'
import {Producto} from '../../Models/Producto'
import {Categoria} from '../../Models/Categoria'

@Component({
  selector: 'app-administrar-productos',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './administrar-productos.component.html',
  styleUrl: './administrar-productos.component.css'
})
export class AdministrarProductosComponent implements OnInit {

  productos: Producto[] = [];
  categorias: Categoria[] = []
  categoriasMap: { [id: number]: string } = {};

  constructor(private productoService: ProductoService, private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.cargarProductos()
  }

  cargarProductos(): void {
    this.productoService.GetProductoCompleto().subscribe((data: Producto[]) => {
      this.productos = data;

      const categoriaIds = Array.from(this.productos.map(p => p.categoriaId));

      console.log(this.productos);
      console.log(this.productos[0].imagenesProductos[0].urlImagen);

      categoriaIds.forEach(id => {
        this.categoriaService.obtener(id).subscribe(categoria => {
          this.categoriasMap[id] = categoria.nombre;
        });
      });
    });

  }

  getTotalStock(producto: Producto): number {
    return producto.variantesProducto.reduce((acc, variante) => acc + variante.cantidad, 0);
  }

  getCategoryName(id: number): string {
    return this.categoriasMap[id] || 'Desconocido';
  }

}
