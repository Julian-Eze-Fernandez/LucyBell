import { Component, EventEmitter, inject, Input, Output, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SeguridadService } from '../../../Services/seguridad.service';
import { Router } from '@angular/router';
import { CredencialesUsuarioCreacionDTO, CredencialesUsuarioDTO } from '../seguridad';
import { extraerErroresIdentity } from '../compartidos/funciones/extraerErrores';
import { FormularioAutenticacionComponent } from "../formulario-autenticacion/formulario-autenticacion.component";
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormularioRegistroComponent } from "../formulario-registro/formulario-registro.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormularioAutenticacionComponent, CommonModule, FormularioRegistroComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      state('open', style({ opacity: 1 })),
      state('closed', style({ opacity: 0 })),
      transition('* => open', [animate('250ms ease-out')]),
      transition('* => closed', [animate('200ms ease-out')]),
    ])
  ]
})
export class LoginComponent {

  seguridadService = inject(SeguridadService);
  router = inject(Router);
  errores: string[] = [];

  loguear(credenciales: CredencialesUsuarioDTO){
    this.seguridadService.login(credenciales)
    .subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: err => {
        const errores = extraerErroresIdentity(err);
        this.errores = errores;
      }
    })
  }

  registrar(credenciales: CredencialesUsuarioCreacionDTO){
    this.seguridadService.registrar(credenciales)
    .subscribe({
      next: () => {
        this.isRegisterOpen = false;
        this.router.navigate(['/']);
      },
      error: err => {
        const errores = extraerErroresIdentity(err);
        this.errores = errores;
      }
    })
  }

  constructor(private sanitizer: DomSanitizer) {}

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isLoginOpen: boolean = false;
  isRegisterOpen: boolean = false;

  animationState = 'closed';

  ngOnChanges() {
    this.animationState = this.isLoginOpen ? 'open' : 'closed';
  }

  openLoginModal() {
    this.isLoginOpen = true;
    this.animationState = 'open';
  }

  closeLoginModal() {
    this.resetearErrores();
    this.animationState = 'closed';
    setTimeout(() => {
      this.isLoginOpen = false;

    }, 200); // Wait for the animation to complete
  }

  onClose(){
    this.cancel.emit();

    if (this.isRegisterOpen) {
      this.closeRegisterModal();
    }
  }

  onConfirm() {
    this.confirm.emit();

  }

  onOverlayClick(event: MouseEvent) {
    // Ensure that clicks outside the modal content area close the modal

    if (event.target === event.currentTarget) {
      this.onClose();
    } 
  }

  openRegisternModal() {
    this.resetearErrores();
    this.isLoginOpen = false;
    this.isRegisterOpen = true;
    this.animationState = 'open';
  }

  closeRegisterModal() {
    this.resetearErrores();
    this.animationState = 'closed';
    setTimeout(() => {
      this.isRegisterOpen = false;

    }, 200); // Wait for the animation to complete
  }

  resetearErrores() {
    this.errores = [];
}
}
