//import { CommonModule } from '@angular/common';
//import { Component, OnInit } from '@angular/core';
//import { SidebarComponent } from '../sidebar/sidebar.component'
//import { CategoriaService } from '../../Services/categoria.service';
//import { SubcategoriaService } from '../../Services/subcategoria.service';
//import { MaterialService } from '../../Services/material.service';
//import { ProductoService } from '../../Services/producto.service';
//import { FormsModule } from '@angular/forms';
//import { ProductoCreacion } from '../../Models/Producto';

//@Component({
//  selector: 'app-agregar-producto',
//  standalone: true,
//  imports: [CommonModule, SidebarComponent, FormsModule],
//  templateUrl: './agregar-producto.component.html',
//  styleUrl: './agregar-producto.component.css'
//})
//export class AgregarProductoComponent implements OnInit {

//  categorias: any[] = [];
//  materiales: any[] = [];
//  subcategorias: any[] = [];
//  selectedCategoriaId: number | null = null;
//  selectedSubcategoriaId: number | null = null;
//  selectedMaterialId: number | null = null;
//  nombre: string = '';
//  descripcion: string = '';
//  precio: number = 0;

//  constructor(
//    private categoriaService: CategoriaService,
//    private materialService: MaterialService,
//    private subcategoriaService: SubcategoriaService,
//    private productoService: ProductoService
//  ) { }

//  ngOnInit() {
//    this.GetCategorias();
//    this.GetMateriales();
//  }

//  GetCategorias() {
//    this.categoriaService.GetCategoriasLista().subscribe({
//      next: (data) => {
//        this.categorias = data;
//      },
//      error: (err) => {
//        console.log(err.message);
//      }
//    });
//  }

//  GetMateriales(): void {
//    this.materialService.GetMaterialesLista().subscribe({
//      next: (data) => {
//        if (data.length >= 0) {
//          this.materiales = data;
//        }
//      },
//      error: (err) => {
//        console.log(err.message)
//      }
//    })
//  }

//  onCategoriaChange(): void {
//    if (this.selectedCategoriaId) {
//      this.subcategoriaService
//        .obtenerSubCategoriasPorCategoria(this.selectedCategoriaId)
//        .subscribe((data) => {
//          this.subcategorias = data;
//        });
//    } else {
//      this.subcategorias = [];
//    }
//  }

//  onSubmitProd(): void {
//    const productoCreacion: ProductoCreacion = {
//      nombre: this.nombre,
//      descripcion: this.descripcion,
//      precio: this.precio,
//    };

//    if (this.selectedCategoriaId && this.selectedSubcategoriaId && this.selectedMaterialId) {
//      this.productoService
//        .PostProducto(this.selectedCategoriaId, this.selectedSubcategoriaId, this.selectedMaterialId, productoCreacion)
//        .subscribe((response) => {
//          console.log('Producto agregado con éxito:', response);
//        }, (error) => {
//          console.error('Error al agregar producto:', error);
//        });
//    }
//    else {
//      console.log('error al agregar producto')
//    }

//  }
//}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CategoriaService } from '../../Services/categoria.service';
import { SubcategoriaService } from '../../Services/subcategoria.service';
import { MaterialService } from '../../Services/material.service';
import { ProductoService } from '../../Services/producto.service';
import { FormsModule } from '@angular/forms';
import { ProductoCreacion } from '../../Models/Producto';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent implements OnInit {

  categorias: any[] = [];
  materiales: any[] = [];
  subcategorias: any[] = [];
  selectedCategoriaId: number | null = null;
  selectedSubcategoriaId: number | null = null;
  selectedMaterialId: number | null = null;
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;

  // Para almacenar las imágenes seleccionadas
  imagenesSeleccionadas: File[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private materialService: MaterialService,
    private subcategoriaService: SubcategoriaService,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    this.GetCategorias();
    this.GetMateriales();
  }

  GetCategorias() {
    this.categoriaService.GetCategoriasLista().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  GetMateriales(): void {
    this.materialService.GetMaterialesLista().subscribe({
      next: (data) => {
        if (data.length >= 0) {
          this.materiales = data;
        }
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  onCategoriaChange(): void {
    if (this.selectedCategoriaId) {
      this.subcategoriaService
        .obtenerSubCategoriasPorCategoria(this.selectedCategoriaId)
        .subscribe((data) => {
          this.subcategorias = data;
        });
    } else {
      this.subcategorias = [];
    }
  }

  // Método para manejar la selección de imágenes
  selectedFiles: File[] = [];

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }


  onSubmitProd(): void {
    const formData = new FormData();

    formData.append('nombre', this.nombre);
    formData.append('descripcion', this.descripcion);
    formData.append('precio', this.precio.toString());

    if (this.selectedCategoriaId) {
      formData.append('categoriaId', this.selectedCategoriaId.toString());
    }

    if (this.selectedSubcategoriaId) {
      formData.append('subcategoriaId', this.selectedSubcategoriaId.toString());
    }

    if (this.selectedMaterialId) {
      formData.append('materialId', this.selectedMaterialId.toString());
    }

    // Agregar las imágenes seleccionadas al FormData
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('imagenes', this.selectedFiles[i], this.selectedFiles[i].name);
    }

    // Llama al servicio para agregar el producto, ahora con FormData
    if (this.selectedCategoriaId != null && this.selectedSubcategoriaId != null && this.selectedMaterialId != null) {
      this.productoService
        .PostProducto(this.selectedCategoriaId, this.selectedSubcategoriaId, this.selectedMaterialId, formData)
        .subscribe((response) => {
          console.log('Producto agregado con éxito:', response);
        }, (error) => {
          console.error('Error al agregar producto:', error);
        });
    } else {
      console.error('Uno o más ID son null o undefined');
    }

  }

}
