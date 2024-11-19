import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { navBarComponent } from '../Components/navBar/navBar.component';
import { NavBarResponsiveComponent } from '../Components/nav-bar-responsive/nav-bar-responsive.component';
import { RouterLink } from '@angular/router'
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../Services/producto.service';
import { CarritoService } from '../../Services/carrito.service';
import { Producto } from '../../Models/Producto';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, navBarComponent, NavBarResponsiveComponent, RouterLink ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {

  quantity = 1;
  product: Producto | null = null;
  selectedImage = '';
  isLargeScreen: boolean = true;


  colors = ['Blanco', 'Morado', 'Azul'];
  selectedColor = 'Blanco';

  constructor( private productoService: ProductoService, private carritoService: CarritoService, private route: ActivatedRoute, ) { }

  ngOnInit(): void {
    this.checkScreenSize();
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productoService.GetProductoById(productId).subscribe({
        next: (product) => (this.product = product, this.selectedImage = this.product?.imagenesProductos[0].urlImagen),  
        error: (err) => console.error('Error, producto no encontrado', err)
      });
    } 
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }

  setSelectedImage(image: string): void {
    this.selectedImage = image;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  agregarProducto(item: Producto){
    this.carritoService.agregar(item);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  addToCart(): void {
    console.log('Producto agregado al carrito');

  }


}
