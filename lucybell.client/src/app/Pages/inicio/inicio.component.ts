import { Component, inject, ViewChild } from '@angular/core';
import { CategoriaService } from '../../Services/categoria.service';
import { SubcategoriaService } from '../../Services/subcategoria.service';
import { MaterialService } from '../../Services/material.service';
import { Categoria, CategoriaABM, CategoriaGetSubCategorias } from '../../Models/Categoria';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from '../one-button-modal/one-button-modal.component';
import { SidebarComponent } from '../sidebar/sidebar.component'
import { Material } from '../../Models/Material';
import { SubCategoria, SubCategoriaCreacionDTO } from '../../Models/SubCategoria';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, TwoButtonModalComponent, OneButtonModalComponent, FormsModule, SidebarComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  @ViewChild('deleteModalCatg') deleteModalCatg!: TwoButtonModalComponent;
  @ViewChild('deleteModalMats') deleteModalMats!: TwoButtonModalComponent;
  @ViewChild('deleteModalSub') deleteModalSub!: TwoButtonModalComponent;

  @ViewChild('addModalCatg') addModalCatg!: TwoButtonModalComponent;
  @ViewChild('addModalMats') addModalMats!: TwoButtonModalComponent;
  @ViewChild('addModalSub') addModalSub!: TwoButtonModalComponent;

  @ViewChild('editModalSub') editModalSub!: TwoButtonModalComponent;
  @ViewChild('editModalCatg') editModalCatg!: TwoButtonModalComponent;
  @ViewChild('editModalMats') editModalMats!: TwoButtonModalComponent;

  private categoriaServicio = inject(CategoriaService)
  private subcategoriaServicio = inject(SubcategoriaService)
  public listaCategoria: CategoriaGetSubCategorias[] = [];
  public displayedColumns: string[] = ['nombre', 'accion']

  selectedSubCategoria: SubCategoria | null = null;

  selectedCategoria: CategoriaABM | null = null;
  
  selectedSubCategoriaEdit: SubCategoria = { id: 0, nombre: '', categoriaId: 0 };
  selectedCategoriaEdit: CategoriaABM = { id: 0, nombre: '' }
  selectedMatEdit: Material = { id: 0, nombre: '' }

  newMatsName: string = '';
  newCategoryName: string = '';
  newSubCategoryName: string = '';

  editSubCategoryName: string = '';
  editCategoryName: string = '';
  editMatName: string = '';


  customIconDelete = "<i class='bx bxs-trash-alt bx-md'></i>"
  customIconAdd = "";
  customIconEdit = "<i class='bx bxs-edit-alt bx-md'></i>"
  
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

  openEditCategoryModal(categoria: CategoriaABM) {
    this.showModal = true;
    this.editModalCatg.openModal();
    this.selectedCategoriaEdit = { ...categoria };
    this.editCategoryName = this.selectedCategoriaEdit.nombre;

    
  }
  closeEditCategoryModal() {
    this.showModal = false;
    this.editModalCatg.closeModal();

  }
  onEditCategory() {
    this.selectedCategoriaEdit.nombre = this.editCategoryName

    this.categoriaServicio.putCategoria(this.selectedCategoriaEdit.id, this.selectedCategoriaEdit).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          
          
          this.closeEditCategoryModal(); 
          this.selectedCategoriaEdit = { id: 0, nombre: '' }
          this.editCategoryName = '';
          this.obtenerCategorias();

        } else {
          alert('Failed to update category: ');
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
   
  }
  onAddCategory() {
    if (this.newCategoryName.trim()) {
      const categoria = { nombre: this.newCategoryName };

      this.categoriaServicio.PostCategoria(categoria).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.obtenerCategorias();
            this.newCategoryName = '';
            
          } else {
            alert('Failed to add category: ');
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
}



