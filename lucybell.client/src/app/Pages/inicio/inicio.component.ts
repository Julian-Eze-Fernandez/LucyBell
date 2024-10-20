import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navBarComponent } from '../navBar/navBar.component';
import { register } from 'swiper/element/bundle';
import { Categoria } from '../../Models/Categoria';
import { CategoriaService } from '../../Services/categoria.service';
import { appsettings } from '../../Settings/appsettings';
import Swiper from 'swiper';
import { SeguridadService } from '../../Services/seguridad.service';
import { AutorizadoComponent } from '../seguridad/autorizado/autorizado.component';
import { NavBarResponsiveComponent } from '../nav-bar-responsive/nav-bar-responsive.component';

register();

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, navBarComponent,NavBarResponsiveComponent,  AutorizadoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  

  constructor(private categoriaService:CategoriaService){}

  ngOnInit(): void {  

    var TrandingSlider = new Swiper('.tranding-slider', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
        
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

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

}
