import { Component, model, OnInit  } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule, } from '@angular/common';
import {VariantesProductoService} from '../../Services/variantes-producto.service';
import {VarianteProductoDTO} from '../../Models/VariantesProducto';
import { ProductoService } from '../../Services/producto.service';
import { Producto } from '../../Models/Producto';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports:[CommonModule, SidebarComponent] ,
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {

  constructor(private VariantesProductoService: VariantesProductoService, private ProductoService: ProductoService) {}

 
 variantesConProducto: { productoNombre: string, variante: VarianteProductoDTO }[] = [];
 productos: Producto[] = [];


 ngOnInit(): void {
  this.cargarStock();
 }

  cargarStock(){
    this.ProductoService.GetProductoCompleto().subscribe((productos) => {
      this.variantesConProducto = productos.flatMap(producto => 
        producto.variantesProducto.map(variante => ({
          productoNombre: producto.nombre,
          variante: variante
        }))
      );
    });
  }
}
    


