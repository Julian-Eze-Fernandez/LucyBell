import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage  } from '@angular/common';
import { navBarComponent } from '../Components/navBar/navBar.component';
import { Categoria } from '../../Models/Categoria';
import { CategoriaService } from '../../Services/categoria.service';
import { appsettings } from '../../Settings/appsettings';
import { SeguridadService } from '../../Services/seguridad.service';
import { NavBarResponsiveComponent } from '../Components/nav-bar-responsive/nav-bar-responsive.component';
import { DestacadosComponent } from '../Components/destacados/destacados.component';
import { FooterComponent } from '../Components/footer/footer.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, navBarComponent, NavBarResponsiveComponent, DestacadosComponent, FooterComponent, NgOptimizedImage ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent implements OnInit {

  seguridadService = inject(SeguridadService);
  showModal: boolean = false;

  listaCategorias: Categoria[] = [];
  isLargeScreen: boolean = true;
  url = appsettings.noApiUrl;
  
  private touchStartX: number | null = null;
  private startX: number = 0;
  private endX: number = 0;
  

  constructor(private categoriaService:CategoriaService, private router: Router){}

  ngOnInit(): void {  

    this.checkScreenSize(); 
    this.obtenerCategorias();
    
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }

  obtenerCategorias() {
    this.categoriaService.GetCategoriasLista().subscribe({
      next: (data) => {
        this.listaCategorias = data.map(c => ({ ...c, isExpanded: false }));
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  goToCategory(categoryId: number) {
    this.router.navigate(['/productos'], { queryParams: { category: categoryId } });
  }

}
