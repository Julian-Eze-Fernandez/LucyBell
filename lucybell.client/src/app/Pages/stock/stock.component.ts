import { Component, HostListener, OnInit, ViewChild  } from '@angular/core';
import { SidebarAdminComponent } from '../sidebarAdmin/sidebarAdmin.component';
import { CommonModule, } from '@angular/common';
import {VariantesProductoService} from '../../Services/variantes-producto.service';
import {VarianteProductoDTO} from '../../Models/VariantesProducto';
import { ProductoService } from '../../Services/producto.service';
import { Producto } from '../../Models/Producto';
import { TwoButtonModalComponent } from '../../Pages/two-button-modal/two-button-modal.component'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, SidebarAdminComponent, TwoButtonModalComponent, FormsModule ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {

  constructor(private VariantesProductoService: VariantesProductoService, private ProductoService: ProductoService) {}

 @ViewChild('deleteModalStock') deleteModalStock!: TwoButtonModalComponent;
 @ViewChild('editModalStock') editModalStock!: TwoButtonModalComponent;

 @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;
  
 variantesConProducto: { productoNombre: string, productoId: number, variante: VarianteProductoDTO, imagen: string | null }[] = [];
  productos: Producto[] = [];
  selectedVariante: VarianteProductoDTO | null = null;
  modalStock: boolean = false;
  selectedProductoNombre:string = '';
  productoIdEdit: number = 0;

  private touchStartX: number | null = null;

  private startX: number = 0;

  private endX: number = 0;

  customIconDelete = `<img src="../../../assets/icons/Delete.svg" width="35" height="35"/>`;
  customIconAdd = `<img src="../../../assets/icons/Add.svg" width="35" height="35"/>`;
  customIconEdit = `<img src="../../../assets/icons/Edit.svg" width="35" height="35"/>`;

 ngOnInit(): void {
  this.cargarStock();
 }

  cargarStock() {
  this.ProductoService.GetProductoCompleto().subscribe((productos) => {

    this.variantesConProducto = productos.flatMap(producto => {

      return producto.variantesProducto.map(variante => {
        const imagen = producto.imagenesProductos?.length > 0 ? producto.imagenesProductos[0].urlImagen : null;

        return {
          productoNombre: producto.nombre,
          productoId: producto.id,
          variante: variante,
          imagen: imagen
        };
      });
    });

  });
}

openEditStockModal(productoId:number ,variante: any, productoNombre: string) {

  this.selectedVariante = variante;
  this.selectedProductoNombre = productoNombre;
  this.productoIdEdit = productoId
  this.modalStock = true;
  this.editModalStock.openModal();
  console.log(this.selectedVariante)
  console.log(this.variantesConProducto)
}
closeEditStockModal() {
  this.editModalStock.closeModal();
  setTimeout(() => {
  this.productoIdEdit = 0;
  this.selectedVariante = null;
  this.modalStock = false;
  this.selectedProductoNombre = '';}, 200)
}
onEdit(): void {
  if (this.selectedVariante) {
    this.VariantesProductoService.PutVariantesProductos(this.productoIdEdit, this.selectedVariante.id, this.selectedVariante).subscribe({
      next: (response) => {
        if (response) {

          this.closeEditStockModal();
          this.cargarStock();
        }
      },
      error: (err) => {
        console.error('Error deleting product:', err);
      }
    })
  }
}



openDeleteStockModal(variante: any, productoNombre: string) {

  this.selectedVariante = variante;
  this.selectedProductoNombre = productoNombre;
  this.modalStock = true;
  this.deleteModalStock.openModal();
}
closeDeleteStockModal() {
  this.deleteModalStock.closeModal();
  setTimeout(() => {
  this.selectedVariante = null;
  this.selectedProductoNombre = '';
  this.modalStock = false;}, 200);
}
onDelete(): void {
  if (this.selectedVariante) {

    this.VariantesProductoService.deleteVariantesProducto(this.selectedVariante.id).subscribe({
      next: (response) => {
        if (response) {

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

toggleChildSidebar(): void {
  this.sidebarAdmin.toggleSidebar();
}

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
      this.sidebarAdmin.toggleSidebar();
    } else if (deltaX < -50) { // Swipe left to close
      this.sidebarAdmin.toggleSidebar();
    }
    this.touchStartX = null;
  }
}

}
    


