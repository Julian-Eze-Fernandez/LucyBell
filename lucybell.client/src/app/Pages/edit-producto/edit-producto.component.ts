import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CategoriaService } from '../../Services/categoria.service';
import { SubcategoriaService } from '../../Services/subcategoria.service';
import { MaterialService } from '../../Services/material.service';
import { ProductoService } from '../../Services/producto.service';
import { FormsModule, Validators, FormGroup, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
@Component({
  selector: 'app-edit-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-producto.component.html',
  styleUrl: './edit-producto.component.css'
})
export class EditProductoComponent implements OnInit, OnChanges{
  @Input() product: any = null; // The product data to be edited
  productoForm!: FormGroup;

  categorias: any[] = [];
  materiales: any[] = [];
  subcategorias: any[] = [];
  selectedCategoriaId: number | null = null;
  selectedSubcategoriaId: number | null = null;
  selectedMaterialId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private materialService: MaterialService,
    private subcategoriaService: SubcategoriaService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    // Initialize the form with only the necessary fields for editing
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      material: [''],
      subcategoria: [{ value: '', disabled: true }],
      descripcion: [''],
      precio: [0, Validators.required]
      
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

  // Handle form submission to update product
  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();


    console.log( '', this.productoForm.value);

    formData.append('nombre', this.productoForm.get('nombre')?.value);

    if (this.selectedCategoriaId) {
      formData.append('categoriaId', this.selectedCategoriaId.toString());
    }
    
    if (this.selectedSubcategoriaId) {
      formData.append('material', this.selectedSubcategoriaId.toString());
    }
    
    if (this.selectedMaterialId) {
      formData.append('subcategoriaId', this.selectedMaterialId.toString());
    }

    formData.append('descripcion', this.productoForm.get('descripcion')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value);



    if(this.selectedCategoriaId){
      
      this.productoService.PutProducto(this.product.id,this.selectedCategoriaId, this.selectedSubcategoriaId, this.selectedMaterialId, formData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
        },
        error: (err) => {
          console.error('Error updating product:', err);
        }
      });
    }
    
  }
}
