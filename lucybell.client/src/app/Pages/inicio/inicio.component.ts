import { Component, inject } from '@angular/core';
import { CategoriaService } from '../../Services/categoria.service';
import { Categoria } from '../../Models/Categoria';
import { Router } from '@angular/router';
import { ModalCategService } from '../../Services/modal-categ.service';
import { ModalCategComponent } from '../modal-categ/modal-categ.component';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  private categoriaServicio = inject(CategoriaService)
  public listaCategoria:Categoria[] = [];
  public displayedColumns : string[] = ['nombre','accion']

  obtenerCategorias(){
    this.categoriaServicio.GetCategoriasLista().subscribe({
      next:(data)=>{
        if(data.length > 0){
          this.listaCategoria = data;
        }
      },
      error:(err)=>{
        console.log(err.message)
      }
    })
  }

  constructor(private router:Router){

    this.obtenerCategorias();
  }

  private readonly _modalSvc = inject(ModalCategService);


  nuevo(){
    this.router.navigate(['/categoria',0])
  }

  editar(objeto:Categoria){
    this.router.navigate(['/categoria',objeto.id]);
  }
  eliminar(objeto:Categoria){
    if(confirm("Desea eliminar la categoria " + objeto.nombre)){
      this.categoriaServicio.DeleteCategoria(objeto.id).subscribe({
        next:(data)=>{
          if(data.isSuccess){
            this.obtenerCategorias();
          }
          else{
            alert("no se pudo eliminar")
          }
        },
        error:(err)=>{
          console.log(err.message)
        }
      })
    }
  }
}

