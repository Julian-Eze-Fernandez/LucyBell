import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navBarComponent } from '../navBar/navBar.component';
import { register } from 'swiper/element/bundle';
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
  imports: [CommonModule, navBarComponent, ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})




export class InicioComponent implements OnInit {

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

  }

  @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
      const space = document.getElementById('navBar-Space');
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      if (space) {
        if (scrollPosition > 5) {
          

          space.classList.remove('mt-80');
          space.classList.add('mt-56');



        } else {
          space.classList.remove('mt-56');
          space.classList.add('mt-80');
        }
      }
    }
  

}
