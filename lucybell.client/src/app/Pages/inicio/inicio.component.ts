import { Component, inject, ViewChild } from '@angular/core';
import { CategoriaService } from '../../Services/categoria.service';
import { MaterialService } from '../../Services/material.service';
import { Categoria } from '../../Models/Categoria';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from '../one-button-modal/one-button-modal.component';
import { SidebarComponent } from '../sidebar/sidebar.component'
import { Material } from '../../Models/Material';
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

  @ViewChild('addModalCatg') addModalCatg!: TwoButtonModalComponent;
  @ViewChild('addModalMats') addModalMats!: TwoButtonModalComponent;

  @ViewChild('editModalCatg') editModalCatg!: TwoButtonModalComponent;
  @ViewChild('editModalMats') editModalMats!: TwoButtonModalComponent;

  private categoriaServicio = inject(CategoriaService)
  public listaCategoria: Categoria[] = [];
  public displayedColumns: string[] = ['nombre', 'accion']
  selectedCategoria: Categoria | null = null;
  selectedCategoriaEdit: Categoria = { id: 0, nombre: '' }
  selectedMatEdit: Material = { id: 0, nombre: '' }
  newCategoryName: string = '';
  editCategoryName: string = '';
  newMatsName: string = '';
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


  openEditCategoryModal(categoria: Categoria) {
    this.showModal = true;
    this.editModalCatg.openModal();
    this.selectedCategoriaEdit = { ...categoria };
    
  }

  closeEditCategoryModal() {
    this.showModal = false;
    this.addModalCatg.closeModal();

  }
  onEditCategory() {
    this.selectedCategoriaEdit.nombre = this.editCategoryName

    this.categoriaServicio.putCategoria(this.selectedCategoriaEdit.id, this.selectedCategoriaEdit).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          // Refresh the list
          
          this.closeEditCategoryModal(); // Close the modal
          this.selectedCategoriaEdit = { id: 0, nombre: '' }
          this.editCategoryName = '';
          this.obtenerCategorias();

        } else {
          alert('Failed to update category: ' /* + response.message */);
        }
      }, 
      error: (err) => {
        console.error('Error updating category:', err);
        alert('An error occurred while updating the category.');
        
      }
    });
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
            alert('Failed to add material: ' /*+ response.message*/);
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
          // Refresh the list

          this.closeEditMatsModal(); // Close the modal
          this.selectedMatEdit = { id: 0, nombre: '' }
          this.editMatName = '';
          this.obtenerMateriales();

        } else {
          alert('Failed to update materiales: ' /* + response.message */);
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
            alert('Failed to add category: ' /*+ response.message*/);
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
        if (data.length >= 0) {
          this.listaCategoria = data;
        }
      },
      error: (err) => {
        console.log(err.message)
      }
    })
  }

  openDeleteModalCatg(categoria: Categoria) {
    this.showModal = true;

    this.selectedCategoria = categoria;
    this.deleteModalCatg.openModal();

    
  }

  closeDeleteModalCatg() {
    this.showModal = false;
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



