import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navBarComponent } from '../navBar/navBar.component';
import { register } from 'swiper/element/bundle';
import { Categoria } from '../../Models/Categoria';
import { CategoriaService } from '../../Services/categoria.service';
import Swiper from 'swiper';

import SwiperCore,{ Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



register();

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, navBarComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})




export class InicioComponent implements OnInit {

  listaCategorias: Categoria[] = []

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

    this.obtenerCategorias();

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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const placeholder = document.getElementById('navBar-Placeholder');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
    if (placeholder) {
      if (scrollPosition > 5) {
        placeholder.classList.remove('h-48,', 'sm:h-60', 'lg:h-80');
        placeholder.classList.add('h-40', 'sm:h-44', 'lg:h-52');
      } else {
        placeholder.classList.remove('h-40', 'sm:h-44', 'lg:h-52');
        placeholder.classList.add('h-48', 'sm:h-60', 'lg:h-80');
      }
    }
  }

}
