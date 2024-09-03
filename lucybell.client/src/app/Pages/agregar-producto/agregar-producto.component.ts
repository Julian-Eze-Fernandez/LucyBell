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
import { VariantesProductoService } from '../../Services/variantes-producto.service';
import { VariantesProductoCreacionDTO } from '../../Models/VariantesProducto';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent implements OnInit {

  imageUrls: string[] = [];
  categorias: any[] = [];
  materiales: any[] = [];
  subcategorias: any[] = [];
  selectedCategoriaId: number | null = null;
  selectedSubcategoriaId: number | null = null;
  selectedMaterialId: number | null = null;
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;

  productoId?: number;  // Assign this based on your application logic
  variantes: VariantesProductoCreacionDTO[] = [];
  currentColor: string = '';
  currentColorCantidad: number = 0;
  currentCantidad: number = 0;
  errorMessage: string = '';
  isAddingColor: boolean = false;

  // Para almacenar las imágenes seleccionadas
  imagenesSeleccionadas: File[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private VariantesProductoService: VariantesProductoService,
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
    this.selectedSubcategoriaId = null;
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


  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenesSeleccionadas[index] = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrls[index] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  //onSubmitProd(): void {
  //  const formData = new FormData();

  //  formData.append('nombre', this.nombre);
  //  formData.append('descripcion', this.descripcion);
  //  formData.append('precio', this.precio.toString());

  //  if (this.selectedCategoriaId) {
  //    formData.append('categoriaId', this.selectedCategoriaId.toString());
  //  }

  //  if (this.selectedSubcategoriaId) {
  //    formData.append('subcategoriaId', this.selectedSubcategoriaId.toString());
  //  }

  //  if (this.selectedMaterialId) {
  //    formData.append('materialId', this.selectedMaterialId.toString());
  //  }

  //  // Agregar las imágenes seleccionadas al FormData
  //  this.imagenesSeleccionadas.forEach((file, index) => {
  //    formData.append('imagenes', file, file.name);
  //  });

  //  // Llama al servicio para agregar el producto, ahora con FormData
  //  if (this.selectedCategoriaId  ) {
  //    this.productoService
  //      .PostProducto(this.selectedCategoriaId, this.selectedSubcategoriaId, this.selectedMaterialId, formData)
  //      .subscribe((response) => {
  //        console.log('Producto agregado con éxito:', response);
  //      }, (error) => {
  //        console.error('Error al agregar producto:', error);

  //      });
  //  } else {
  //    console.error('Uno o más ID son null o undefined');
  //  }

  //}

  //onSubmitProd(): void {
  //  const formData = new FormData();
  //  formData.append('nombre', this.nombre);
  //  formData.append('descripcion', this.descripcion);
  //  formData.append('precio', this.precio.toString());

  //  if (this.selectedCategoriaId) {
  //    formData.append('categoriaId', this.selectedCategoriaId.toString());
  //  }

  //  if (this.selectedSubcategoriaId) {
  //    formData.append('subcategoriaId', this.selectedSubcategoriaId.toString());
  //  }

  //  if (this.selectedMaterialId) {
  //    formData.append('materialId', this.selectedMaterialId.toString());
  //  }

  //  // Add selected images to FormData
  //  this.imagenesSeleccionadas.forEach((file, index) => {
  //    formData.append('imagenes', file, file.name);
  //  });

  //  // Post Producto and handle response
  //  if (this.selectedCategoriaId)
  //  {
  //    this.productoService.PostProducto(this.selectedCategoriaId, this.selectedSubcategoriaId, this.selectedMaterialId, formData)
  //      .pipe(
  //        switchMap((productoResponse: any) => {
  //          // After Producto is successfully created, get the productoId
  //          const productoId = productoResponse.productoId;

  //          // Prepare VariantesProducto to post
  //          let variantesToPost = this.variantes;
  //          if (!this.isAddingColor) {
  //            variantesToPost = [{ color: null, cantidad: this.currentCantidad }];
  //          }

  //          // Post VariantesProducto with the productoId
  //          return this.VariantesProductoService.postVariantesProductos(productoId, variantesToPost );
  //        })
  //      )
  //      .subscribe({
  //        next: (response) => {
  //          console.log('Producto y VariantesProducto agregados con éxito:', response);
  //        },
  //        error: (error) => {
  //          console.error('Error al agregar producto o variantes:', error);
  //          // Handle rollback if needed, e.g., delete Producto if VariantesProducto fails
  //        }
  //      });
  //  }

  //}



  onSubmitProd(): void {
    const formData = new FormData();

    // Append product data
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

    // Add images
    this.imagenesSeleccionadas.forEach((file, index) => {
      formData.append('imagenes', file, file.name);
    });

    if (this.selectedCategoriaId){
      this.productoService.PostProducto(this.selectedCategoriaId, this.selectedSubcategoriaId, this.selectedMaterialId, formData)
        .subscribe({
          next: (response: any) => {
            this.productoId = response.productoId; // Assuming 'id' is returned in the response

            // If `productoId` exists, create variants
            if (this.productoId) {
              this.createVariants(this.productoId);
            }
          },
          error: (err) => {
            console.error('Error al agregar producto:', err);
          }
        });
    }
    
  }

  createVariants(productoId: number): void {
    if (this.isAddingColor && this.variantes.length > 0) {
      
      this.VariantesProductoService.postVariantesProductos(productoId, this.variantes)
        .subscribe({
          next: (response) => {
            console.log('Variante producto added successfully:', response);
          },
          error: (err) => {
            console.error('Error adding variante producto:', err);

            // Rollback the product if variant creation fails
            this.productoService.DeleteProducto(productoId).subscribe({
              next: () => console.log('Producto rolled back due to variant creation failure'),
              error: (deleteErr) => console.error('Error rolling back producto:', deleteErr)
            });
          }
        });
      
    } else {
      const defaultVariante: VariantesProductoCreacionDTO[] = [{ color: null, cantidad: this.currentCantidad }];

      this.VariantesProductoService.postVariantesProductos(productoId, defaultVariante)
        .subscribe({
          next: (response) => {
            console.log('Default variante producto added successfully:', response);
          },
          error: (err) => {
            console.error('Error adding default variante producto:', err);

            // Rollback the product if default variant creation fails
            this.productoService.DeleteProducto(productoId).subscribe({
              next: () => console.log('Producto rolled back due to default variant creation failure'),
              error: (deleteErr) => console.error('Error rolling back producto:', deleteErr)
            });
          }
        });
    }
  }


  toggleAddColor(): void {
    this.isAddingColor = !this.isAddingColor;

    if (!this.isAddingColor) {
      // Clear all variants and reset cantidad when cancelling
      this.variantes = [];
      this.currentCantidad = 0;
    } else {
      // Disable and reset cantidad when adding color
      this.currentCantidad = 0;
    }
  }

  addColor(): void {
    const trimmedColor = this.currentColor.trim();

    if (!trimmedColor) {
      this.errorMessage = 'El campo color no puede estar vacio';
      return;
    }

    const colorExists = this.variantes.some(v => v.color && v.color.toLowerCase() === trimmedColor.toLowerCase());

    if (colorExists) {
     this.errorMessage = `El color ${trimmedColor} ya ha sido añadido`;
     return;
    }

    this.variantes.push({ color: trimmedColor, cantidad: this.currentColorCantidad });
    this.currentColor = '';
    this.currentColorCantidad = 0;
    this.errorMessage = '';
  }

  removeColor(color: string): void {
    if (color !== null) {
      this.variantes = this.variantes.filter(v => v.color !== color);

      if (this.variantes.length === 0) {
        this.isAddingColor = false;
        this.currentCantidad = 0;
      }
    } 
  }

}
