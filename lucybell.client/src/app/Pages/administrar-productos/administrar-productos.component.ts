import { Component, OnInit, ViewChild, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from '../sidebarAdmin/sidebarAdmin.component';
import { ProductoService } from '../../Services/producto.service';
import { CategoriaService } from '../../Services/categoria.service';
import {Producto} from '../../Models/Producto';
import {Categoria} from '../../Models/Categoria';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';

import { AgregarProductoComponent } from "../agregar-producto/agregar-producto.component";
import  {EditProductoComponent} from '../edit-producto/edit-producto.component';
import  {VariantesProductoService} from '../../Services/variantes-producto.service';

@Component({
  selector: 'app-administrar-productos',
  standalone: true,
  imports: [CommonModule, TwoButtonModalComponent, AgregarProductoComponent, EditProductoComponent, SidebarAdminComponent],
  templateUrl: './administrar-productos.component.html',
  styleUrl: './administrar-productos.component.css'
})
export class AdministrarProductosComponent implements OnInit {

  @ViewChild(AgregarProductoComponent) agregarProductoComponent!: AgregarProductoComponent;
  @ViewChild(EditProductoComponent) editProductoComponent!: EditProductoComponent;
  @ViewChild('addModalProd') addModalProd!: TwoButtonModalComponent;
  @ViewChild('deleteModalProd') deleteModalProd!: TwoButtonModalComponent;
  @ViewChild('editModalProd') editModalProd!: TwoButtonModalComponent;

  @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;

  productos: Producto[] = [];
  selectedProducto: Producto | null = null;
  categorias: Categoria[] = []
  categoriasMap: { [id: number]: string } = {};
  showModal: boolean = false;
  isSuccess: boolean = false;
  initialFormValues: any;

  private touchStartX: number | null = null;
  private startX: number = 0;
  private endX: number = 0;

  customIconDelete = `<img src="../../../assets/icons/Delete.svg">`;
  customIconAdd = `<img src="../../../assets/icons/Add.svg">`;
  customIconEdit = `<img src="../../../assets/icons/Edit.svg">`;

  tieneVariantes: boolean = false;

  constructor(private productoService: ProductoService, private categoriaService: CategoriaService, private VariantesProductoService: VariantesProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.GetProductoCompleto().subscribe((data: Producto[]) => {
      this.productos = data;
    });

  }

  openEditModal(producto: any): void {
    this.selectedProducto = producto;
    this.showModal = true;
    this.editModalProd.openModal();
  }

  closeEditModal(): void {
    this.selectedProducto = null;
    this.showModal = false;
    this.editProductoComponent.reiniciarForm();
    this.editModalProd.closeModal();
  }

  onEdit(): void {
    if (this.editProductoComponent.productoForm.valid) {
      this.editProductoComponent.onSubmit().subscribe({
        next: (response) => {
          if (response) {
            this.closeEditModal();
            setTimeout(() => {
              this.cargarProductos();
            } , 200)
          }
        },
        error: (err) => {
          console.error('Error updating product:', err);
        }
      });
    }
  }


  getTotalStock(producto: Producto): number {
    return producto.variantesProducto.reduce((acc, variante) => acc + variante.cantidad, 0);
  }

  getCategoryName(id: number): string {
    return this.categoriasMap[id] || 'Desconocido';
  }

  openAddProdModal() {
    this.showModal = true;
    this.addModalProd.openModal();

  }
  closeAddProdModal() {
    this.showModal = false;
    this.addModalProd.closeModal();
    this.agregarProductoComponent.reiniciarForm();
    this.agregarProductoComponent.limpiarImgenes();
    this.cargarProductos();

  }

  openDeleteProdModal( categoria: any) {
    this.showModal = true;
    this.selectedProducto = categoria;
    this.deleteModalProd.openModal();

    if(this.selectedProducto?.variantesProducto.length == 0){
      this.tieneVariantes = true;
    }
  }
  closeDeleteProdModal() {
    this.deleteModalProd.closeModal();

    setTimeout(() => {
    this.tieneVariantes = false;
    this.selectedProducto = null;
    this.showModal = false;}, 200);
    
  }

  onDelete(): void { 
    if(this.selectedProducto){

      this.productoService.DeleteProducto(this.selectedProducto.id).subscribe({
        next: (response) => {
          if (response) {
            this.closeDeleteProdModal();
            this.cargarProductos();
          }
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      })
    }

  }

  onSubmitProd(){
    this.agregarProductoComponent.onSubmitProd()

    if(this.agregarProductoComponent.productoForm.valid){
    this.closeAddProdModal();  
    setTimeout(() => {
    this.cargarProductos();}, 300);
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

      if (deltaX > 50) { 
        this.sidebarAdmin.toggleSidebar();
      } else if (deltaX < -50) { 
        this.sidebarAdmin.toggleSidebar();
      }
      this.touchStartX = null;
    }
  }

}
