import { Component, HostListener, inject, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../Services/categoria.service';
import { SeguridadService } from '../../../Services/seguridad.service';
import { AutorizadoComponent } from "../../seguridad/autorizado/autorizado.component";
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from "../../seguridad/login/login.component";
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../../Services/carrito.service';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  standalone: true,
  imports: [CommonModule, AutorizadoComponent, LoginComponent, CarritoComponent, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './navBar.component.css'
})
export class navBarComponent implements OnInit {
  seguridadService = inject(SeguridadService);
  carritoService = inject(CarritoService);
  @ViewChild('loginModal') loginModal!: LoginComponent;
  showModal: boolean = false;

  constructor(private categoriaService: CategoriaService, private router: Router) {}

  categorias: any[] = [];

  isLargeScreen: boolean = true;

  ngOnInit(): void {
    this.GetCategorias()
    this.checkScreenSize()
  }

  goToCategory(categoryId: number) {
    this.router.navigate(['/productos'], { queryParams: { category: categoryId } });
  }

  GetCategorias() {
    this.categoriaService.GetCategoriasLista().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  cartOpen = false;

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  closeCart() {
    this.cartOpen = false;
  }

  @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
      const logoContainer = document.getElementById('logo-container');
      const logoContainerVine1 = document.getElementById('logo-container-vine1');
      const logoContainerVine2 = document.getElementById('logo-container-vine2');
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      if (logoContainer && logoContainerVine1 && logoContainerVine2) {
        if (scrollPosition > 5) {

          setTimeout(() => {
            logoContainer.classList.remove('h-36', 'md:h-44', 'lg:h-64');
            logoContainer.classList.add('h-16');
  
            logoContainerVine1.classList.remove('h-24', 'md:h-48', 'lg:h-64');
            logoContainerVine1.classList.add('h-24');
  
            logoContainerVine2.classList.remove('h-24', 'md:h-48', 'lg:h-64');
            logoContainerVine2.classList.add('h-24');
          }, 200);


        } else {
          setTimeout(() => {
            logoContainer.classList.remove('h-16');
            logoContainer.classList.add('h-36', 'md:h-44', 'lg:h-64');
  
            logoContainerVine1.classList.remove('h-24');
            logoContainerVine1.classList.add('h-24', 'md:h-48', 'lg:h-64');
  
            logoContainerVine2.classList.remove('h-24');
            logoContainerVine2.classList.add('h-24', 'md:h-48', 'lg:h-64');
            
          }, 200);


        }
      }
    }

    openLoginModal() {
      this.showModal = true;
      this.loginModal.openLoginModal();
  
    }

    closeLoginModal() {
      this.showModal = false;
      this.loginModal.closeLoginModal();
  
    }

    onSubmitLogin(){

  
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
      this.checkScreenSize(); 
    }
  
    checkScreenSize(): void {
      this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
    }
}