import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { SeguridadService } from '../../../Services/seguridad.service';
import { Router } from '@angular/router';
import { CredencialesUsuarioDTO } from '../seguridad';
import { extraerErroresIdentity } from '../funciones/extraerErrores';
import { FormularioAutenticacionComponent } from "../formulario-autenticacion/formulario-autenticacion.component";
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormularioAutenticacionComponent, CommonModule],
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
        this.router.navigate(['/'])
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

  isOpen: boolean = false;

  animationState = 'closed';

  ngOnChanges() {
    this.animationState = this.isOpen ? 'open' : 'closed';
  }

  openModal() {
    this.isOpen = true;
    this.animationState = 'open';
  }

  closeModal() {
    this.animationState = 'closed';
    setTimeout(() => {
      this.isOpen = false;

    }, 200); // Wait for the animation to complete
  }

  onClose(){
    this.cancel.emit();
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

}
