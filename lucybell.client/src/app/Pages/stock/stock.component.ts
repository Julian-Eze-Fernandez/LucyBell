import { Component, model, OnInit, ViewChild  } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule, } from '@angular/common';
import {VariantesProductoService} from '../../Services/variantes-producto.service';
import {VarianteProductoDTO} from '../../Models/VariantesProducto';
import { ProductoService } from '../../Services/producto.service';
import { Producto } from '../../Models/Producto';
import { TwoButtonModalComponent } from '../../Pages/two-button-modal/two-button-modal.component'

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TwoButtonModalComponent],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {

  constructor(private VariantesProductoService: VariantesProductoService, private ProductoService: ProductoService) {}

 @ViewChild('deleteModalStock') deleteModalStock!: TwoButtonModalComponent;
  
 variantesConProducto: { productoNombre: string, variante: VarianteProductoDTO }[] = [];
  productos: Producto[] = [];
  selectedVariante: VarianteProductoDTO | null = null;
  customIcon = '';



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

  openDeleteStockModal(variante: any) {

    this.selectedVariante = variante;
    this.deleteModalStock.openModal();

  }
  closeDeleteStockModal() {

    this.selectedVariante = null;

    this.deleteModalStock.closeModal();

  }

  onDelete(): void {
    if (this.selectedVariante) {

      this.VariantesProductoService.deleteVariantesProducto(this.selectedVariante.id).subscribe({
        next: (response) => {
          if (response) {
            // Only close the modal and reload products if the update was successful
            this.closeDeleteStockModal();
            this.cargarStock();
          }
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      })
    }

  }

}
    


