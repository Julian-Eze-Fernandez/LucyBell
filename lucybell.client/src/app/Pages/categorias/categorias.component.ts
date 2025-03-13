import { Component, inject, ViewChild, HostListener } from '@angular/core';
import { CategoriaService } from '../../Services/categoria.service';
import { SubcategoriaService } from '../../Services/subcategoria.service';
import { MaterialService } from '../../Services/material.service';
import {  CategoriaABM, CategoriaGetSubCategorias } from '../../Models/Categoria';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TwoButtonModalComponent } from '../Components/two-button-modal/two-button-modal.component';
import { SidebarAdminComponent } from '../Components/sidebarAdmin/sidebarAdmin.component';
import { Material } from '../../Models/Material';
import { SubCategoria, SubCategoriaCreacionDTO } from '../../Models/SubCategoria';
import { FormsModule } from '@angular/forms';
import {appsettings} from '../../Settings/appsettings';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { provideAnimations  } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, TwoButtonModalComponent, FormsModule, SidebarAdminComponent],
  providers: [provideAnimations()],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class CategoriasComponent {

  url = appsettings.noApiUrl;

  @ViewChild('deleteModalCatg') deleteModalCatg!: TwoButtonModalComponent;
  @ViewChild('deleteModalMats') deleteModalMats!: TwoButtonModalComponent;
  @ViewChild('deleteModalSub') deleteModalSub!: TwoButtonModalComponent;

  @ViewChild('addModalCatg') addModalCatg!: TwoButtonModalComponent;
  @ViewChild('addModalMats') addModalMats!: TwoButtonModalComponent;
  @ViewChild('addModalSub') addModalSub!: TwoButtonModalComponent;

  @ViewChild('editModalSub') editModalSub!: TwoButtonModalComponent;
  @ViewChild('editModalCatg') editModalCatg!: TwoButtonModalComponent;
  @ViewChild('editModalMats') editModalMats!: TwoButtonModalComponent;

  @ViewChild(SidebarAdminComponent) sidebarAdmin!: SidebarAdminComponent;

  private categoriaServicio = inject(CategoriaService)
  private subcategoriaServicio = inject(SubcategoriaService)
  public listaCategoria: CategoriaGetSubCategorias[] = [];
  public displayedColumns: string[] = ['nombre', 'accion']

  selectedSubCategoria: SubCategoria | null = null;

  selectedCategoria: CategoriaABM | null = null;
  
  selectedSubCategoriaEdit: SubCategoria = { id: 0, nombre: '', categoriaId: 0 };
  selectedCategoriaEdit: CategoriaABM = { id: 0, nombre: '', urlImagen: '' };
  selectedMatEdit: Material = { id: 0, nombre: '' };

  newMatsName: string = '';
  newCategoryName: string = '';
  selectedImage: File | null = null;
  imageUrl: string | null = null;
  newSubCategoryName: string = '';

  editSubCategoryName: string = '';
  editCategoryName: string = '';
  editMatName: string = '';


  customIconDelete = `<img src="../../../assets/icons/Delete.svg" width="35" height="35"/>`;
  customIconAdd = `<img src="../../../assets/icons/Add.svg" width="35" height="35"/>`;
  customIconEdit = `<img src="../../../assets/icons/Edit.svg" width="35" height="35"/>`;
  
  private materialServicio = inject(MaterialService)
  public listaMaterial: Material[] = [];
  public displayedColumnsMats: string[] = ['nombre', 'accion']
  selectedMaterial: Material | null = null;

  constructor(private router: Router) {
    this.obtenerCategorias();
    this.obtenerMateriales();
  }

  showModal: boolean = false;

  toggleSubcategories(categoria: CategoriaGetSubCategorias) {
    categoria.isExpanded = !categoria.isExpanded;
    console.log(categoria.isExpanded)
  }

  toggleChildSidebar(): void {
    this.sidebarAdmin.toggleSidebar();
  }

  openEditCategoryModal(categoria: CategoriaABM) {
    this.showModal = true;
    this.editModalCatg.openModal();
    this.selectedCategoriaEdit = { ...categoria };
    this.editCategoryName = this.selectedCategoriaEdit.nombre;

    
  }
  closeEditCategoryModal() {
    this.showModal = false;
    this.selectedImage = null; 
    this.imageUrl = null;
    this.selectedCategoriaEdit = { id: 0, nombre: '', urlImagen: '' };
    this.editModalCatg.closeModal();

  }

  onEditCategory() {
    const formData = new FormData();
    formData.append('nombre', this.editCategoryName);
    
    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage); 
    }
  
    this.categoriaServicio.putCategoria(this.selectedCategoriaEdit.id, formData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.closeEditCategoryModal();
          this.selectedCategoriaEdit = { id: 0, nombre: '', urlImagen: '' };
          this.editCategoryName = '';
          this.selectedImage = null; 
          this.imageUrl = null;
          this.obtenerCategorias();
        } else {
          alert('Failed to update category');
        }
      },
      error: (err) => {
        console.error('Error updating category:', err);
        alert('An error occurred while updating the category.');
      }
    });

    
  }

  openAddSubCategoryModal(categoria: CategoriaABM) {
    this.showModal = true;
    this.addModalSub.openModal();
    this.selectedCategoria = { ...categoria };
  }
  closeAddSubCategoryModal() {
    this.showModal = false;
    this.addModalSub.closeModal();
    this.newSubCategoryName = '';
  }
  onAddSubcategory() {
    if (this.newSubCategoryName.trim() && this.selectedCategoria) {
      const subCategoria: SubCategoriaCreacionDTO = { nombre: this.newSubCategoryName, categoriaId: this.selectedCategoria.id};

      this.subcategoriaServicio.PostSubCategoria(this.selectedCategoria.id, subCategoria).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.obtenerCategorias();
            this.closeAddSubCategoryModal();
          } else {
            alert('Failed to add subcategory');
          }
        },
        error: (err) => {
          console.error('Error adding subcategory:', err);
          alert('An error occurred while adding the subcategory.');
        }
      });
    }
  }

  openEditSubCategoryModal(subCategoria: SubCategoria, categoria: CategoriaABM) {
    this.showModal = true;
    this.editModalSub.openModal();
    this.selectedSubCategoriaEdit = { categoriaId: categoria.id, id: subCategoria.id, nombre: subCategoria.nombre };
    this.editSubCategoryName = this.selectedSubCategoriaEdit.nombre;
  }
  closeEditSubCategoryModal() {
    this.showModal = false;
    this.editModalSub.closeModal();
    this.selectedSubCategoriaEdit = { id: 0, nombre: '', categoriaId: 0 };
    this.editSubCategoryName = '';
  }
  onEditSubcategory() {
    this.selectedSubCategoriaEdit.nombre = this.editSubCategoryName;

    this.subcategoriaServicio.PutSubCategoria(this.selectedSubCategoriaEdit.categoriaId, this.selectedSubCategoriaEdit.id, this.selectedSubCategoriaEdit).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.obtenerCategorias();
          this.closeEditSubCategoryModal();
        } else {
          alert('Failed to update subcategory: ');
        }
      },
      error: (err) => {
        console.error('Error updating subcategory:', err);
        alert('An error occurred while updating the subcategory.');
      }
    });
  }

  openDeleteSubCategoryModal(subCategoria: SubCategoria, categoria: CategoriaABM) {
    this.showModal = true;
    this.selectedCategoria = categoria;
    this.selectedSubCategoria = subCategoria;
    this.deleteModalSub.openModal();
  }
  closeDeleteSubCategoryModal() {
    this.showModal = false;
    this.selectedSubCategoria = null;
    this.deleteModalSub.closeModal();
  }
  onConfirmDeleteSubcategory() {
    if (this.selectedCategoria && this.selectedSubCategoria) {
      this.subcategoriaServicio.DeleteSubCategoria(this.selectedCategoria.id, this.selectedSubCategoria.id).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.obtenerCategorias();
          } else {
            alert('Failed to delete subcategory');
          }
          this.closeDeleteSubCategoryModal();
        },
        error: (err) => {
          console.error('Error deleting subcategory:', err);
          alert('An error occurred while deleting the subcategory.');
          this.closeDeleteSubCategoryModal();
        }
      });
    }
  }



  openAddMatsModal() {
    this.showModal = true;

    this.addModalMats.openModal();


  }
  closeAddMatsModal() {
    this.showModal = false;
    this.addModalMats.closeModal();

  }
  onAddMats() {
    if (this.newMatsName.trim()) {
      const material = { nombre: this.newMatsName };

      this.materialServicio.PostMaterial(material).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.obtenerMateriales();
            this.newMatsName = '';
            this.closeAddMatsModal();

          } else {
            alert('Failed to add material: ');
          }

        },
        error: (err) => {
          console.error('Error adding material:', err);
          alert('An error occurred while adding the material.');
        }
      });
    }
  }

  openEditMatsModal(material: Material) {
    this.showModal = true;
    this.editModalMats.openModal();
    this.selectedMatEdit = { ...material };
    this.editMatName = material.nombre;
  }
  closeEditMatsModal() {
    this.showModal = false;
    this.editModalMats.closeModal();
  }
  onEditMats() {
    this.selectedMatEdit.nombre = this.editMatName

    this.materialServicio.PutMaterial(this.selectedMatEdit.id, this.selectedMatEdit).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          

          this.closeEditMatsModal(); 
          this.selectedMatEdit = { id: 0, nombre: '' }
          this.editMatName = '';
          this.obtenerMateriales();

        } else {
          alert('Failed to update materiales: ');
        }
      },
      error: (err) => {
        console.error('Error updating material:', err);
        alert('An error occurred while updating the material.');

      }
    });
  }

  openAddCategoryModal() {
    this.showModal = true;

    this.addModalCatg.openModal();
   

  }
  closeAddCategoryModal() {
    this.showModal = false;
    this.addModalCatg.closeModal();
    this.selectedImage = null; 
    this.imageUrl = null;
   
  }

  imagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onAddCategory() {
    if (this.newCategoryName.trim()) {
      const formData = new FormData();
      formData.append('nombre', this.newCategoryName);

      if (this.selectedImage) {
        formData.append('imagen', this.selectedImage);
      } else {
        // If no new image is selected, keep the existing image URL
        formData.append('urlImagen', this.selectedCategoriaEdit.urlImagen || '');
      }
  
      this.categoriaServicio.PostCategoria(formData).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.obtenerCategorias();
            this.newCategoryName = '';
            this.selectedImage = null; 
            this.imageUrl = null;
            this.closeAddCategoryModal();
          } else {
            alert('Failed to add category');
          }
        },
        error: (err) => {
          console.error('Error adding category:', err);
          alert('An error occurred while adding the category.');
        }
      });
    }
  }
  obtenerCategorias() {
    this.categoriaServicio.GetCategoriasLista().subscribe({
      next: (data) => {
        this.listaCategoria = data.map(c => ({ ...c, isExpanded: false }));
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  openDeleteModalCatg(categoria: CategoriaABM) {
    this.showModal = true;

    this.selectedCategoria = categoria;
    this.deleteModalCatg.openModal();

    
  }
  closeDeleteModalCatg() {
    this.showModal = false;
    this.deleteModalCatg.closeModal();
    this.selectedCategoria = null;
    
  }
  onConfirmDeleteCatg() {
    if (this.selectedCategoria) {
      this.categoriaServicio.DeleteCategoria(this.selectedCategoria.id).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.obtenerCategorias();
          } else {
            alert("No se pudo eliminar");
          }
          this.closeDeleteModalCatg();
        },
        error: (err) => {
          console.log(err.message);
          this.closeDeleteModalCatg();
        }
      });
    }
  }

  obtenerMateriales() {
    this.materialServicio.GetMaterialesLista().subscribe({
      next: (data) => {
        if (data.length >= 0) {
          this.listaMaterial = data;
        }
      },
      error: (err) => {
        console.log(err.message)
      }
    })
  }

  openDeleteModalMats(material: Material) {
    this.showModal = true;
    
      this.selectedMaterial = material;
      this.deleteModalMats.openModal();

    
  }
  closeDeleteModalMats() {
    this.showModal = false;
    this.deleteModalMats.closeModal();
    this.selectedCategoria = null;
    
  }
  onConfirmDeleteMats() {
    if (this.selectedMaterial) {
      this.materialServicio.DeleteMaterial(this.selectedMaterial.id).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.obtenerMateriales();
          } else {
            alert("No se pudo eliminar");
          }
          this.closeDeleteModalMats();
        },
        error: (err) => {
          console.log(err.message);
          this.closeDeleteModalMats();
        }
      });
    }
  }

  private touchStartX: number | null = null;

  private startX: number = 0;

  private endX: number = 0;

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



