import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { navBarComponent } from '../Components/navBar/navBar.component';
import { NavBarResponsiveComponent } from '../Components/nav-bar-responsive/nav-bar-responsive.component';
import { RouterLink } from '@angular/router'
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../Services/producto.service';
import { CarritoService } from '../../Services/carrito.service';
import { Producto, ProductoSinVariantesDTO } from '../../Models/Producto';
import { FooterComponent } from '../Components/footer/footer.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, navBarComponent, NavBarResponsiveComponent, RouterLink, FooterComponent],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {

  quantity = 1;
  product: Producto | null = null;
  selectedImage = '';
  isLargeScreen: boolean = true;
  relatedProducts: ProductoSinVariantesDTO[] = [];
  private routeSubscription!: Subscription;

  colors = ['Blanco', 'Morado', 'Azul'];
  selectedColor = 'Blanco';

  constructor( private productoService: ProductoService, private carritoService: CarritoService, private route: ActivatedRoute, ) { }

  ngOnInit(): void {
    this.checkScreenSize();
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const productId = Number(params.get('id'));
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadProductDetails(productId: number): void {
    // Fetch product details
    this.productoService.GetProductoById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = this.product?.imagenesProductos[0]?.urlImagen; // Safely handle missing images
      },
      error: (err) => console.error('Error, producto no encontrado', err)
    });

    // Fetch related products
    this.productoService.GetRelatedProducts(productId, 4).subscribe({
      next: (related) => {
        this.relatedProducts = related;
        console.log('Related Products:', related);
      },
      error: (err) => console.error('Error, productos no encontrados', err)
    });
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

  onProductClick(product:any) {
    console.log('Producto clickeado:', product);
  }


}
