import { Component,  CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../Models/Producto';
import { ProductoService } from '../../../Services/producto.service';
import Swiper from 'swiper';
import { timeout } from 'rxjs';

@Component({
  standalone:true,
  selector: 'app-destacados',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './destacados.component.html',
  styleUrl: './destacados.component.css'
})
export class DestacadosComponent implements OnInit {

  productos: Producto[] = [];

  constructor( private productoService: ProductoService) {}
ngOnInit(): void {
  this.cargarProductos()
}

intializeSwiper(): void {
  console.log(this.productos.length);
  var TrandingSlider = new Swiper('.tranding-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    loopAdditionalSlides: 2,
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
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  }); 
  TrandingSlider.autoplay.start(); 
}

cargarProductos(): void {
  this.productoService.GetProductoCompleto().subscribe((data: Producto[]) => {
    this.productos = data.filter(producto => producto.destacado === true);
    setTimeout(() => {
      this.intializeSwiper();
    },100)
  });
}

}
