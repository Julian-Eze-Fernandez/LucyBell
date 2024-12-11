import { Component, HostListener, OnInit, ViewChild  } from '@angular/core';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { CommonModule, } from '@angular/common';
import {VariantesProductoService} from '../../Services/variantes-producto.service';
import {VarianteProductoDTO} from '../../Models/VariantesProducto';
import { ProductoService } from '../../Services/producto.service';
import { Producto } from '../../Models/Producto';
import { Material } from '../../Models/Material';
import {CategoriaName} from '../../Models/Categoria';
import { SubCategoria } from '../../Models/SubCategoria';
import { TwoButtonModalComponent } from '../Components/two-button-modal/two-button-modal.component'
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../Services/material.service';
import { CategoriaService } from '../../Services/categoria.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, SidebarAdminComponent, TwoButtonModalComponent, FormsModule ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {

  constructor(private VariantesProductoService: VariantesProductoService, private ProductoService: ProductoService, private categoriaService: CategoriaService, private materialService: MaterialService) {}

 @ViewChild('deleteModalStock') deleteModalStock!: TwoButtonModalComponent;
 @ViewChild('editModalStock') editModalStock!: TwoButtonModalComponent;

 @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;
  
  variantesConProducto: { productoNombre: string, productoId: number, variante: VarianteProductoDTO, imagen: string | null }[] = [];
  productos: Producto[] = [];
  selectedVariante: VarianteProductoDTO | null = null;
  modalStock: boolean = false;
  selectedProductoNombre:string = '';
  productoIdEdit: number = 0;

  listaCategorias: CategoriaName[] = []
  listaSubCategorias: SubCategoria[] = []
  filteredSubcategories: any[] = [];
  listaMateriales: Material[] = [];
  selectedCategoryId: number | null | undefined;
  selectedSubCategoryId: number | null | undefined;
  selectedMaterialId: number | null | undefined;
  currentPage: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  totalPages: number = 0;

  private touchStartX: number | null = null;
  private startX: number = 0;
  private endX: number = 0;

  customIconDelete = `<img src="../../../assets/icons/Delete.svg" width="35" height="35"/>`;
  customIconAdd = `<img src="../../../assets/icons/Add.svg" width="35" height="35"/>`;
  customIconEdit = `<img src="../../../assets/icons/Edit.svg" width="35" height="35"/>`;

 ngOnInit(): void {
  this.cargarStockFiltrado();
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


cargarStockFiltrado(): void {
  this.ProductoService.GetFilteredProductsVariants(
    this.selectedCategoryId,
    this.selectedSubCategoryId,
    this.selectedMaterialId,
    this.currentPage,
    this.pageSize
  ).subscribe((response: HttpResponse<Producto[]>) => {
    // Extract the body (the list of products with variants for the current page)
    const productosDTO = response.body || [];

    // Flatten the variants for the current page
    this.variantesConProducto = productosDTO.flatMap(producto => {
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

    // Update the total count and calculate total pages based on the X-Total-Count header
    const totalCountHeader = response.headers.get('X-Total-Count');
    this.totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
    console.log (this.totalCount);
    this.calculateTotalPages(); // Recalculate total pages based on the total count of variants
  });
}

onCategoryChange(categoryId: number | null ): void {
  if (categoryId === null) {
    this.selectedCategoryId = null;
    this.selectedSubCategoryId = null;
    this.cargarStockFiltrado();
    this.filteredSubcategories = this.listaSubCategorias.filter(
      subCategory => subCategory.categoriaId === this.selectedCategoryId
    )
    return;
  }
  this.selectedCategoryId = categoryId;
  this.selectedSubCategoryId = null;
  this.cargarStockFiltrado();

  this.filteredSubcategories = this.listaSubCategorias.filter(
    subCategory => subCategory.categoriaId === this.selectedCategoryId
  )
}

onSubCategoryChange(subCategoryId: number | null): void {
  this.selectedSubCategoryId = subCategoryId;
  this.cargarStockFiltrado();
}

onMaterialChange(materialId: number | null): void {
  this.selectedMaterialId = materialId;
  this.cargarStockFiltrado();
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.cargarStockFiltrado();
}

calculateTotalPages(): void {
  this.totalPages = Math.ceil(this.totalCount / this.pageSize);
}

openEditStockModal(productoId:number ,variante: any, productoNombre: string) {

  this.selectedVariante = variante;
  this.selectedProductoNombre = productoNombre;
  this.productoIdEdit = productoId
  this.modalStock = true;
  this.editModalStock.openModal();
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
          this.cargarStockFiltrado();
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
          this.cargarStockFiltrado();
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
    


