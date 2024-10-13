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
import { SidebarAdminComponent } from '../sidebarAdmin/sidebarAdmin.component'
import { Material } from '../../Models/Material';
import { SubCategoria, SubCategoriaCreacionDTO } from '../../Models/SubCategoria';
import { FormsModule } from '@angular/forms';
import {appsettings} from '../../Settings/appsettings';




@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, TwoButtonModalComponent, OneButtonModalComponent, FormsModule, SidebarAdminComponent,],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  appsettings = appsettings;

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


  customIconDelete = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <rect width="35" height="35" fill="url(#pattern0_830_4)"/>
                        <defs>
                          <pattern id="pattern0_830_4" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image0_830_4" transform="scale(0.01)"/>
                          </pattern>
                          <image id="image0_830_4" width="100" height="100" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACtElEQVR4nO2dPYsTURiFHz9ALey0EhdZ8C+ohYggiP0iopXaWYggLDYWLxaLhZ02FmKnIFsLoqCFP8FyFwVFsLARRBYWrwyOIOLNJnESzn09D7xNCDM55xkyNyTkgjHGGGOMMcYYY4wxZlbsB84By8CNKeYycNh6/p09wD1gAygDzFNgwWKmYxfweiARv88nYNFSJmdlBjJ+TSfaTMBu4MsMhXRzzEbG58SMZXRz00LG50KlxG/A8wnnY+VY9y1kfC5WSnw7RYkPK8fqHjcWMj929svJIWa5clW/n+JYq5VjrQ74evciyKE53IiL6HRvsXJYiBgWIoaFiGEhYliI+LK3tiI5P+Byc3EOM04OyWXvn9SCnKQtSpIcaYKUJDnSBClJcqQJUpLkSBOkJMmRJkhJkiNNkJIkR5ogJUmOiYMcr/zIrfsAVqP2w7iFAc/x3wqJyvNfNnYOWRTLCgvRKissRKussBCtssJCtMoKC9EqKyxEq6ywEK2ywkK0ygoL0SorLESrrLAQrbLCQrTKCgvRKissRKussBCtssJCtMoKC9EqKyxEq6ywEK2ywkK0ygoL0SorLESrrLAQrbLCQrTKCgvRKissRKussBCtssJCtMoKC9EqKyxEq6ywEK2ywkLGL+sasP6XeTRCyHpljg54jkmly5IlSEmSI02QkiRHmiAlSY40QUqSHGmClCQ50gQpSXLwtRJkiXbYN0LIERpjLcF/rl8aIeQAjfG4EuQ7cB3Yjjangc+VDB+AbTTG2RFXV+nDvppi+4lZzwvg3Rav/S4NsgN4s0Ww0uBstLyH1SlgU6DEMuA0vzPP1f6+URLMkxbvHbUtjGrL4NLAdBfUnf5tOA0HgQeNidkEnrX4mWPS3TvPAFeAW8BtsVnpvzdZ6rd8NcYYY4wxxhhjjDHG8JMfT2SLuEV5t3oAAAAASUVORK5CYII="/>
                        </defs>
                      </svg>`;
  customIconAdd = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="35" height="35" fill="url(#pattern0_1031_10)"/>
                      <defs>
                        <pattern id="pattern0_1031_10" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use xlink:href="#image0_1031_10" transform="scale(0.01)"/>
                        </pattern>
                        <image id="image0_1031_10" width="100" height="100" xlink:href="data:image/png;base64,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"/>
                      </defs>
                    </svg>`;
  customIconEdit = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="35" height="35" fill="url(#pattern0_1031_11)"/>
                      <defs>
                        <pattern id="pattern0_1031_11" patternContentUnits="objectBoundingBox" width="1" height="1">
                         <use xlink:href="#image0_1031_11" transform="scale(0.01)"/>
                        </pattern>
                      <image id="image0_1031_11" width="100" height="100" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADx0lEQVR4nO2dO4gUSRyHPy0f4MWaKSI+DhVBVMTAVcdEMBCzFZ/IiRyiiCCCiCsoCoKigokGCroLmxlorOhmKj6D45ITBMPz/UZHGmphGKa6u7pntsuu3weVVdd2/b/9b1V1d9WCEEIIIYQQQgghhBCiDswCdgBHgAvACWAvsAaYUPXNxcJkYD/wHGimlNfAVWBO1TdcZzYCLzJEtJdvwEVgStU3XyfGAYeAH54yWstjYGbVHakDBhgsIaK1vAJmVN2h313GtS7JGC2PgD+q7tjvKmMoR4D/BU4Bu4ADwE3ge8Y1yZgiuizjE/C3rdvOIuBBxkA/2+eGYsbkkPE/sCKjnWRWdSuljStj1J/ay3gHLM/ZXiLlfopULR5LykjGhlX4sdD+ierU3mrPtqLBeMymThdo/4ajrT096Es0s6lmS0meWfmwt0vt1B5TQEaRYG51tHG+h32LSkbTU8pxx/WHe9zHWsn4CAwAX0pKGQ/847h2+xj1txYyGrb++pJS9qRcF/3DRpNjNpXIWNsW1HXA5wKzr2W2vU71nxA5xjMz2vHNlOV28eequ4+IMQUzg4KZshJ4m1LnP/vmMUpMycwokilpT3t/AhuIFNOlzCiSKa5yjEgxXc6MIpnSXgbt6+DoMD3KjDKZMhzr013T48xo52gOGUOOF1m1x4xRZozSB7xXZnRGMgLCKDPCwUhGOBjJCAcjGeFgJCMcjGSEg5GMcDCSEQ6SERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERiXc3yM/AE4CEws+bMaKXv6ov/weTQ7sj5Gbi3Pcpyy40IycjC/wA6j7/YcKh/69BV6PrYU3PbVtKe05dlt1NCfqfycKyEkKScz2u9TZvhxN2V714A9bDhLyk5H2w1lhh/j7elrnYK829aZClzPEPKtw0DfkAx//kwJ8tK2un9l7O1+2jIlbkhGMTY7gvvVcYrBhgwpByWjHGcdgX2Ycs2ujMXjRy36inPHEbxLGdcVPdZ7KNatx3kH9LcZA7qLaTlnX03JyM+8lOAtyXH9gIeM4VhPSPBhk+eAnjDJzr522yArM7rIGUdAk/PQsb/RC4Bt9mTOkQKn6wwrM/Jz2xHEl3aW5TrpWWNGD0geCL4pGXBlRheZKxlh0d8DIe/tm0dTdefqtEL3Cf6IHey32cFfIkow4hH8dx2CnywqRZeYmPK8ScGvgMU2+ImUe3Y90m//22WUhz9WzXQrRY8yhBBCCCGEEEIIIQRjzC/+K5V61K/KawAAAABJRU5ErkJggg=="/>
                      </defs>
                    </svg>`;
  
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
}



