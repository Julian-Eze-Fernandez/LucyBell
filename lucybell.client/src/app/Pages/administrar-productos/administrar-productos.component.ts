import { Component, OnInit, ViewChild, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { ProductoService } from '../../Services/producto.service';
import { CategoriaService } from '../../Services/categoria.service';
import {Producto} from '../../Models/Producto';
import {CategoriaName} from '../../Models/Categoria';
import { TwoButtonModalComponent } from '../Components/two-button-modal/two-button-modal.component';
import { Material } from '../../Models/Material';
import {MaterialService} from '../../Services/material.service';
import { AgregarProductoComponent } from "../Components/agregar-producto/agregar-producto.component";
import  {EditProductoComponent} from '../Components/edit-producto/edit-producto.component';
import { HttpResponse } from '@angular/common/http';
import { SubCategoria } from '../../Models/SubCategoria';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrar-productos',
  standalone: true,
  imports: [CommonModule, TwoButtonModalComponent, AgregarProductoComponent, EditProductoComponent, SidebarAdminComponent, FormsModule],
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
  listaCategorias: CategoriaName[] = []
  listaSubCategorias: SubCategoria[] = []
  filteredSubcategories: any[] = [];
  listaMateriales: Material[] = [];
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


  selectedCategoryId: number | null | undefined;
  selectedSubCategoryId: number | null | undefined;
  selectedMaterialId: number | null | undefined;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 12;
  totalCount: number = 0;
  totalPages: number = 0;

  constructor(private productoService: ProductoService, private categoriaService: CategoriaService, private materialService: MaterialService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategoriesAndSubcategories();
    this.loadMaterials();
  }

  loadCategoriesAndSubcategories(): void {
    this.categoriaService.GetCategoriasLista().subscribe({
      next: (data) => {

        this.listaCategorias = data.map(category => ({
          id: category.id,
          nombre: category.nombre,
        }));

        data.forEach(category => {
          if (category.subCategorias) { // 
            category.subCategorias.forEach(subcategory => {
              this.listaSubCategorias.push({
                id: subcategory.id,
                nombre: subcategory.nombre,
                categoriaId: category.id 
              });
            });
          }
        });
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  loadMaterials(): void {
    this.materialService.GetMaterialesLista().subscribe({
      next: (data) => {
        this.listaMateriales = data.map(c => ({ ...c, isExpanded: false }));

      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  loadProducts(): void {
    this.productoService.GetFilteredProducts(
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      this.selectedMaterialId,
      this.searchTerm,
      this.currentPage,
      this.pageSize
    ).subscribe((response: HttpResponse<Producto[]>) => {  
      this.productos = response.body || [];
      this.totalCount = +response.headers.get('X-Total-Count')!;
      console.log(this.totalCount);
      this.calculateTotalPages();
    });
  }

  onCategoryChange(categoryId: number | null ): void {
    if (categoryId === null) {
      this.selectedCategoryId = null;
      this.selectedSubCategoryId = null;
      this.loadProducts();
      this.filteredSubcategories = this.listaSubCategorias.filter(
        subCategory => subCategory.categoriaId === this.selectedCategoryId
      )
      return;
    }
    this.selectedCategoryId = categoryId;
    this.selectedSubCategoryId = null;
    this.currentPage = 1;
    this.loadProducts();

    this.filteredSubcategories = this.listaSubCategorias.filter(
      subCategory => subCategory.categoriaId === this.selectedCategoryId
    )

  }

  onSubCategoryChange(subCategoryId: number | null): void {
    this.selectedSubCategoryId = subCategoryId;
    this.currentPage = 1;
    this.loadProducts();
  }

  onMaterialChange(materialId: number | null): void {
    this.selectedMaterialId = materialId;
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
    console.log(this.searchTerm);
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
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
              this.loadProducts();
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


  openAddProdModal() {
    this.showModal = true;
    this.addModalProd.openModal();

  }
  closeAddProdModal() {
    this.showModal = false;
    this.addModalProd.closeModal();
    this.agregarProductoComponent.reiniciarForm();
    this.agregarProductoComponent.limpiarImgenes();
    this.loadProducts();

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
            this.loadProducts();
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
    this.loadProducts();}, 300);
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
