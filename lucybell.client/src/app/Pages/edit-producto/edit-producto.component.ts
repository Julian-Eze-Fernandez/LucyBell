import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CategoriaService } from '../../Services/categoria.service';
import { SubcategoriaService } from '../../Services/subcategoria.service';
import { MaterialService } from '../../Services/material.service';
import { ProductoService } from '../../Services/producto.service';
import { FormsModule, Validators, FormGroup, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { VariantesProductoService } from '../../Services/variantes-producto.service';
import { VariantesProductoCreacionDTO } from '../../Models/VariantesProducto';
import { Producto } from '../../Models/Producto';
@Component({
  selector: 'app-edit-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-producto.component.html',
  styleUrl: './edit-producto.component.css'
})
export class EditProductoComponent implements OnInit, OnChanges{
  @Input() product: Producto | null = null; // The product data to be edited
  productoForm!: FormGroup;

  categorias: any[] = [];
  materiales: any[] = [];
  subcategorias: any[] = [];
  selectedCategoriaId: number | null = null;
  selectedSubcategoriaId: number | null = null;
  selectedMaterialId: number | null = null;
  nuevoColor: string = '';
  errorMessage: string = '';

  arrayImages: { id: number; urlImagen: string }[] = [];
  imagenesSeleccionadas: File[] = []; 
  imageUrls: string[] = [];
  variantes: VariantesProductoCreacionDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private materialService: MaterialService,
    private subcategoriaService: SubcategoriaService,
    private categoriaService: CategoriaService,
    private VariantesProductoService: VariantesProductoService
  ) {}

  ngOnInit(): void {
    // Initialize the form with only the necessary fields for editing
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      material: [''],
      subcategoria: [{ value: ''}],
      descripcion: [''],
      precio: [0, Validators.required],
      nuevoColor: ['']
      
    });

    this.GetCategorias();
    
    this.GetMateriales();

    
    // Pre-fill the form with product data

    this.productoForm.get('categoria')?.valueChanges.subscribe(value => {
      this.selectedCategoriaId = value;
      this.onCategoriaChange();
    });

  }

  ngOnChanges(changes: SimpleChanges):void {
    if (changes['product'] && changes['product'].currentValue) {  
      this.fillWithData();
    }
    console.log(this.product);
  };

  fillWithData(){
    if(this.product){
      this.productoForm.patchValue({
        nombre: this.product.nombre,
        categoria: this.product.categoriaId,
        material: this.product.materialId, 
        subcategoria: this.product.subCategoriaId,
        descripcion: this.product.descripcion,
        precio: this.product.precio
      });
      
      this.arrayImages = this.product.imagenesProductos || [];    

      this.imageUrls = this.arrayImages.map((image) => image.urlImagen);


    }
  }

  onFileSelected(event: any, index: number): void {
    const file: File = event.target.files[0];
    if (file) {
      // Replace the image at the specific index with the new one
      this.imagenesSeleccionadas[index] = file;
      // Generate a preview URL for the newly selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrls[index] = e.target.result; // Update the image URL for preview
      };
      reader.readAsDataURL(file);
    }
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
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    } else {
      this.subcategorias = [];
    }
  }

  addColor(): void {
    this.nuevoColor = this.productoForm.get('nuevoColor')?.value;

    if (this.nuevoColor == '') {
      this.errorMessage = 'El campo color no puede estar vacio';
      return;
    }

    const colorExists = this.variantes.some(v => v.color && v.color.toLowerCase() === this.nuevoColor.toLowerCase());

    const colorExistEnProd = this.product?.variantesProducto.some(v => v.color && v.color.toLowerCase() === this.nuevoColor.toLowerCase());

    if (colorExists) {
     this.errorMessage = `El color ${this.nuevoColor} ya esta siendo añadido`;
     return;
    }
    else if (colorExistEnProd) {
      this.errorMessage = `El color ${this.nuevoColor} ya existe en el producto`;
      return;
    }

    this.variantes.push({ color: this.nuevoColor, cantidad: 0});

    this.errorMessage = '';
  }

  removeColor(color: string): void {
    if (color !== null) {
      this.variantes = this.variantes.filter(v => v.color !== color);
    } 
  }

  limpiarForm(): void {
    setTimeout(() => {
      this.productoForm = this.fb.group({
        nombre: ['', Validators.required],
        categoria: ['', Validators.required],
        material: [''],
        subcategoria: [{ value: ''}],
        descripcion: [''],
        precio: [0, Validators.required],
        nuevoColor: ['']
      });
      this.errorMessage = '';
      this.variantes = [];
    }, 200);
    
  }

  // Handle form submission to update product
  onSubmit(): Observable<any> {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return of(null);
    }

    const formData = new FormData();

    formData.append('nombre', this.productoForm.get('nombre')?.value);

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

    formData.append('descripcion', this.productoForm.get('descripcion')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value);

    this.imagenesSeleccionadas.forEach((file, index) => {
      if (file) {
        formData.append(`imagenes[${index}]`, file, file.name);
      }
    });

    if(this.product && this.variantes.length > 0){
      
    this.VariantesProductoService.postVariantesProductos(this.product.id, this.variantes).subscribe({})
    this.variantes = [];
    }

    if(this.selectedCategoriaId){
      if(this.product != null){
      
        return this.productoService.PutProducto(this.product.id ,this.selectedCategoriaId, this.selectedSubcategoriaId, this.selectedMaterialId, formData)
      }
    }



    return of(null);
  }
}
