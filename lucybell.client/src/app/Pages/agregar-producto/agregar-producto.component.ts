import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CategoriaService } from '../../Services/categoria.service';
import { SubcategoriaService } from '../../Services/subcategoria.service';
import { MaterialService } from '../../Services/material.service';
import { ProductoService } from '../../Services/producto.service';
import { FormsModule, Validators, FormGroup, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ProductoCreacion } from '../../Models/Producto';
import { VariantesProductoService } from '../../Services/variantes-producto.service';
import { VariantesProductoCreacionDTO } from '../../Models/VariantesProducto';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule, ReactiveFormsModule],
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
  


  productoId?: number;  
  variantes: VariantesProductoCreacionDTO[] = [];
  currentColor: string = '';
  currentColorCantidad: number = 0;
  currentCantidad: number = 0;
  errorMessage: string = '';
  isAddingColor: boolean = false;
  productoForm!: FormGroup;
  // Para almacenar las imágenes seleccionadas
  imagenesSeleccionadas: File[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private VariantesProductoService: VariantesProductoService,
    private materialService: MaterialService,
    private subcategoriaService: SubcategoriaService,
    private productoService: ProductoService
  ) { }



  ngOnInit() {
    this.GetCategorias();
    this.GetMateriales();

    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      material: [''],
      subcategoria: [{ value: '', disabled: true }],
      descripcion: [''],
      precio: [0, Validators.required],
      cantidad: [0, Validators.required],
      currentColor: [''],
      currentColorCantidad: [0]
    });

    this.productoForm.get('categoria')?.valueChanges.subscribe(value => {
      this.selectedCategoriaId = value;
      this.onCategoriaChange();
    });

  }
  
  limpiarImgenes() {
    this.imageUrls = [];
    this.imagenesSeleccionadas = [];
  }

  reiniciarForm(){
    setTimeout(() => {
      this.productoForm = this.fb.group({
        nombre: ['', Validators.required],
        categoria: ['', Validators.required],
        material: [''],
        subcategoria: [{ value: '', disabled: true }],
        descripcion: [''],
        precio: [0, Validators.required],
        cantidad: [0, Validators.required],
        currentColor: [''],
        currentColorCantidad: [0]
      });
      this.errorMessage = '';
      this.isAddingColor = false;
    }, 200); 
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
    const subcategoriaControl = this.productoForm.get('subcategoria');
    if (this.selectedCategoriaId) {
      this.subcategoriaService.obtenerSubCategoriasPorCategoria(this.selectedCategoriaId).subscribe({
        next: (data) => {
          this.subcategorias = data;
          subcategoriaControl?.enable();
        },
        error: (err) => {
          console.log(err.message);
          subcategoriaControl?.disable();
        }
      });
    } else {
      this.subcategorias = [];
      subcategoriaControl?.disable();
    }
  }



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


  onSubmitProd(): void {
    
    if(this.isAddingColor){
      if(this.variantes.length == 0){
        this.errorMessage = 'Debe agregar al menos un color';
        return;
      }
    }

    if (this.productoForm.invalid) {

      this.productoForm.markAllAsTouched();
    }

    const formData = new FormData();

    // Append product data
    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value);
    formData.append('descripcion', this.productoForm.get('descripcion')?.value);

    if (this.selectedCategoriaId) {
      formData.append('categoriaId', this.selectedCategoriaId.toString());
    }
    
    this.selectedSubcategoriaId = this.productoForm.get('subcategoria')?.value;

    if (this.selectedSubcategoriaId) {
      formData.append('subCategoriaId', this.selectedSubcategoriaId.toString());
    }

    this.selectedMaterialId = this.productoForm.get('material')?.value;

    if (this.selectedMaterialId) {
      formData.append('materialId', this.selectedMaterialId.toString());
    }

    formData.append('currentColor', this.productoForm.get('currentColor')?.value);
    this.currentColorCantidad = this.productoForm.get('currentColorCantidad')?.value;

    formData.append('precio', this.productoForm.get('precio')?.value);

    this.currentCantidad = this.productoForm.get('cantidad')?.value;
    this.currentColor = this.productoForm.get('currentColor')?.value;
    this.currentColorCantidad = this.productoForm.get('currentColorCantidad')?.value;


    this.imagenesSeleccionadas.forEach((file, index) => {
      formData.append('imagenes', file, file.name);
    });
   

    if (this.selectedCategoriaId){
      this.productoService.PostProducto(this.selectedCategoriaId, this.selectedSubcategoriaId, this.selectedMaterialId, formData)
        .subscribe({
          next: (response: any) => {
            this.productoId = response.productoId; 

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

    

  createVariants(productoId: number) {
    if (this.isAddingColor && this.variantes.length > 0) {
      this.VariantesProductoService.postVariantesProductos(productoId, this.variantes)
        .subscribe({
          next: (response) => {
            console.log('Variante producto added successfully:', response);
            this.variantes = [];
            this.isAddingColor = false;
          },
          error: (err) => {
            console.error('Error adding variante producto:', err);
            this.variantes = [];
            this.isAddingColor = false;

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

      this.variantes = [];
      this.currentCantidad = 0;
      this.productoForm.value.cantidad = 0;
    } else {

      this.currentCantidad = 0;
      this.productoForm.patchValue({
        cantidad: 0
      });

    }
  }

  addColor(): void {
    this.currentColor = this.productoForm.get('currentColor')?.value;
    this.currentColorCantidad = this.productoForm.get('currentColorCantidad')?.value;
    const trimmedColor = this.currentColor;

    if (trimmedColor == '') {
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
    
  
