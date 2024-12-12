import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductoService } from '../../../Services/producto.service';
import { Producto } from '../../../Models/Producto';
import { appsettings } from '../../../Settings/appsettings';
import { HttpResponse } from '@angular/common/http';
import { CategoriaService } from '../../../Services/categoria.service';
import { SubcategoriaService } from '../../../Services/subcategoria.service';
import { MaterialService } from '../../../Services/material.service';
import { CategoriaName } from '../../../Models/Categoria';
import { SubCategoria } from '../../../Models/SubCategoria';
import { Material } from '../../../Models/Material';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, FormsModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent implements OnInit {

  constructor( private productoService: ProductoService, private categoriaService: CategoriaService, private subcategoriaService: SubcategoriaService, private materialService: MaterialService, private router: Router, private route: ActivatedRoute) {}

  appsettings = appsettings;
  productos: Producto[] = [];
  listaCategorias: CategoriaName[] = [];
  listaSubCategorias: SubCategoria[] = [];
  listaMateriales: Material[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  filteredSubcategories: any[] = [];

  selectedCategoryId?: number | null;
  selectedSubCategoryId?: number | null;
  selectedMaterialId?: number | null;

  isLargeScreen: boolean = true;
  showSearchInput: boolean = false;

  ngOnInit(): void {
    this.loadMaterials();  
    this.loadCategoriesAndSubcategories();
    this.checkScreenSize(); 

    this.route.queryParams.subscribe((params) => {

      this.selectedCategoryId = params['category'] ? +params['category'] : null;

      this.loadProducts();
    });
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
      
      this.calculateTotalPages();
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
    console.log(this.searchTerm);
  }

  onCategoryChange(categoryId: number | null ): void {
    if (categoryId === null) {
      this.selectedCategoryId = null;
      this.selectedSubCategoryId = null;
      this.currentPage = 1;
      this.loadProducts();
      this.filteredSubcategories = this.listaSubCategorias.filter(
        subCategory => subCategory.categoriaId === this.selectedCategoryId
      )
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: this.selectedCategoryId },
        queryParamsHandling: 'merge', 
      });
  
      return;
    }
    this.selectedCategoryId = categoryId;
    this.selectedSubCategoryId = null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: this.selectedCategoryId },
      queryParamsHandling: 'merge', 
    });

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

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }
  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }

  toggleSearchInput(): void {
    this.showSearchInput = true;
  }
  closeSearchInput(): void {
    this.showSearchInput = false;
  }
}
