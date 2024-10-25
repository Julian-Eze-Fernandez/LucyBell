import { Component,  CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../Models/Producto';
import { ProductoService } from '../../Services/producto.service';
import Swiper from 'swiper';

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
  
  var TrandingSlider = new Swiper('.tranding-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    loopAdditionalSlides: 3,
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
    // Filter the products where the 'destacados' property is true
    this.productos = data.filter(producto => producto.destacado === true);
  });
}

}
