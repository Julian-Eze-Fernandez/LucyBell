import { Component, HostListener, inject, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../Services/categoria.service';
import { CategoriaABM } from '../../Models/Categoria';
import { SeguridadService } from '../../Services/seguridad.service';
import { AutorizadoComponent } from "../seguridad/autorizado/autorizado.component";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormularioAutenticacionComponent } from "../seguridad/formulario-autenticacion/formulario-autenticacion.component";
import { LoginComponent } from "../seguridad/login/login.component";

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  standalone: true,
  imports: [CommonModule, AutorizadoComponent, RouterModule, FormsModule, FormularioAutenticacionComponent, LoginComponent],
  styleUrl: './navBar.component.css'
})
export class navBarComponent implements OnInit {
  seguridadService = inject(SeguridadService);
  @ViewChild('loginModal') loginModal!: LoginComponent;
  showModal: boolean = false;


  constructor(private categoriaService: CategoriaService) {}

  categorias: any[] = [];

  isMobile = window.innerWidth < 640;

  ngOnInit(): void {
    this.GetCategorias()
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

  @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
      const logoContainer = document.getElementById('logo-container');
      const logoContainerVine1 = document.getElementById('logo-container-vine1');
      const logoContainerVine2 = document.getElementById('logo-container-vine2');
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      if (logoContainer && logoContainerVine1 && logoContainerVine2) {
        if (scrollPosition > 5) {

          setTimeout(() => {
            logoContainer.classList.remove('h-36', 'sm:h-44', 'lg:h-64');
            logoContainer.classList.add('h-16');
  
            logoContainerVine1.classList.remove('h-24', 'md:h-48', 'lg:h-64');
            logoContainerVine1.classList.add('h-24');
  
            logoContainerVine2.classList.remove('h-24', 'md:h-48', 'lg:h-64');
            logoContainerVine2.classList.add('h-24');
          }, 200);


        } else {
          setTimeout(() => {
            logoContainer.classList.remove('h-16');
            logoContainer.classList.add('h-36', 'sm:h-44', 'lg:h-64');
  
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
      this.loginModal.openModal();
  
    }

    closeLoginModal() {
      this.showModal = false;
      this.loginModal.closeModal();
  
    }

    onSubmitLogin(){

  
    }
}