import { Component, inject, ViewChild } from '@angular/core';
import { CategoriaService } from '../../Services/categoria.service';
import { Categoria } from '../../Models/Categoria';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from '../one-button-modal/one-button-modal.component';




@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, TwoButtonModalComponent, OneButtonModalComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  @ViewChild('deleteModal') deleteModal!: OneButtonModalComponent;
  private categoriaServicio = inject(CategoriaService)
  public listaCategoria: Categoria[] = [];
  public displayedColumns: string[] = ['nombre', 'accion']
  selectedCategoria: Categoria | null = null;
  customIcon = "<i class='bx bxs-trash-alt bx-md'></i>"


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


  constructor(private router: Router) {

    this.obtenerCategorias();
  }

  nuevo() {
    this.router.navigate(['/categoria', 0])
  }

  editar(objeto: Categoria) {
    this.router.navigate(['/categoria', objeto.id]);
  }
  eliminar(objeto: Categoria) {
    if (confirm("Desea eliminar la categoria " + objeto.nombre)) {
      this.categoriaServicio.DeleteCategoria(objeto.id).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.obtenerCategorias();
          }
          else {
            alert("no se pudo eliminar")
          }
        },
        error: (err) => {
          console.log(err.message)
        }
      })
    }
  }

  showModal: boolean = false;

  openDeleteModal(categoria: Categoria) {
    this.selectedCategoria = categoria;
    this.deleteModal.openModal();
  }

  closeDeleteModal() {
    this.selectedCategoria = null;
  }

  onConfirmDelete() {
    if (this.selectedCategoria) {
      this.categoriaServicio.DeleteCategoria(this.selectedCategoria.id).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.obtenerCategorias();
          } else {
            alert("No se pudo eliminar");
          }
          this.closeDeleteModal();
        },
        error: (err) => {
          console.log(err.message);
          this.closeDeleteModal();
        }
      });
    }
  }
}



