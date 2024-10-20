import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { SeguridadService } from '../../Services/seguridad.service';
import { LoginComponent } from '../seguridad/login/login.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AutorizadoComponent } from '../seguridad/autorizado/autorizado.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { navBarComponent } from '../navBar/navBar.component';
import { FormularioAutenticacionComponent } from '../seguridad/formulario-autenticacion/formulario-autenticacion.component';

@Component({
  selector: 'app-nav-bar-responsive',
  standalone: true,
  imports: [CommonModule, navBarComponent,NavBarResponsiveComponent, SidebarComponent, AutorizadoComponent, FormsModule, FormularioAutenticacionComponent, LoginComponent, RouterModule],
  templateUrl: './nav-bar-responsive.component.html',
  styleUrl: './nav-bar-responsive.component.css'
})
export class NavBarResponsiveComponent {
  seguridadService = inject(SeguridadService);
  @ViewChild('loginModal') loginModal!: LoginComponent;
  showModal: boolean = false;

  isLargeScreen: boolean = true;
  
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }

  toggleChildSidebar(): void {
    this.sidebar.toggleSidebar();
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
}
