import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../Services/producto.service';
import { PaginatedProductos, Producto } from '../../../Models/Producto';
import { appsettings } from '../../../Settings/appsettings';
import { HttpResponse } from '@angular/common/http';
import { CategoriaService } from '../../../Services/categoria.service';
import { SubcategoriaService } from '../../../Services/subcategoria.service';
import { MaterialService } from '../../../Services/material.service';
import { Categoria } from '../../../Models/Categoria';
import { CategoriaName } from '../../../Models/Categoria';
import { SubCategoria } from '../../../Models/SubCategoria';
import { Material } from '../../../Models/Material';
import { CarritoService } from '../../../Services/carrito.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent implements OnInit {

  constructor( private productoService: ProductoService, private categoriaService: CategoriaService, private subcategoriaService: SubcategoriaService, private materialService: MaterialService, private carritoService: CarritoService ) {}

  productos: Producto[] = [];
  listaCategorias: CategoriaName[] = [];
  listaSubCategorias: SubCategoria[] = [];
  listaMateriales: Material[] = [];
  appsettings = appsettings;
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  filteredSubcategories: any[] = [];

  selectedCategoryId?: number | null;
  selectedSubCategoryId?: number | null;
  selectedMaterialId?: number | null;

  ngOnInit(): void {
    this.loadMaterials();  
    this.loadProducts();
    this.loadCategoriesAndSubcategories();
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
      this.currentPage,
      this.pageSize
    ).subscribe((response: HttpResponse<Producto[]>) => {  
      this.productos = response.body || [];
      this.totalCount = +response.headers.get('X-Total-Count')!;

      console.log("Response Headers:", response.headers.keys());
      console.log("X-Total-Count:", response.headers.get('X-Total-Count'));
      
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
    this.loadProducts();

    this.filteredSubcategories = this.listaSubCategorias.filter(
      subCategory => subCategory.categoriaId === this.selectedCategoryId
    )
    console.log("filteredSubcategories", this.filteredSubcategories);
    console.log("listaCategorias", this.listaSubCategorias);
  }

  onSubCategoryChange(subCategoryId: number | null): void {
    this.selectedSubCategoryId = subCategoryId;
    this.loadProducts();
  }

  onMaterialChange(materialId: number | null): void {
    this.selectedMaterialId = materialId;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    console.log("totalCount", this.totalCount);
  }

  agregarProducto(item: Producto) {
    this.carritoService.agregar(item);
  }

}
