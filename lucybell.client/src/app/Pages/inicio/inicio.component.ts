import { Component, inject, ViewChild } from '@angular/core';
import { CategoriaService } from '../../Services/categoria.service';
import { MaterialService } from '../../Services/material.service';
import { Categoria } from '../../Models/Categoria';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from '../one-button-modal/one-button-modal.component';
import { Material } from '../../Models/Material';




@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, TwoButtonModalComponent, OneButtonModalComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  @ViewChild('deleteModalCatg') deleteModalCatg!: OneButtonModalComponent;
  private categoriaServicio = inject(CategoriaService)
  public listaCategoria: Categoria[] = [];
  public displayedColumns: string[] = ['nombre', 'accion']
  selectedCategoria: Categoria | null = null;
  customIconCatg = "<i class='bx bxs-trash-alt bx-md'></i>"

  @ViewChild('deleteModalMats') deleteModalMats!: OneButtonModalComponent;
  private materialServicio = inject(MaterialService)
  public listaMaterial: Material[] = [];
  public displayedColumnsMats: string[] = ['nombre', 'accion']
  selectedMaterial: Material | null = null;
  customIconMats = "<i class='bx bxs-trash-alt bx-md'></i>"

  constructor(private router: Router) {
    this.obtenerCategorias();
    this.obtenerMateriales();
  }
  showModal: boolean = false;


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
    this.selectedCategoria = categoria;
    this.deleteModalCatg.openModal();
  }

  closeDeleteModalCatg() {
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
    this.selectedMaterial = material;
    this.deleteModalMats.openModal();
  }

  closeDeleteModalMats() {
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



