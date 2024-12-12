import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeguridadService } from '../../Services/seguridad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restablecer-contrasena-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restablecer-contrasena-solicitud.component.html',
  styleUrl: './restablecer-contrasena-solicitud.component.css'
})

export class RestablecerContrasenaSolicitudComponent {
  formulario: FormGroup;
  mensaje: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private seguridadService: SeguridadService
  ) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  volverTienda(): void {
    this.router.navigate(['']);
  }

  enviarSolicitud(): void {
    if (this.formulario.invalid) {
      this.mensaje = 'Por favor, introduce un correo válido.';
      return;
    }

    const email = this.formulario.value.email;
    this.seguridadService.solicitarRestablecimientoContrasena(email).subscribe({
      next: (response) => {
        this.mensaje = 'Se ha enviado un enlace para restablecer tu contraseña.';
      },
      error: (error) => {
        console.error(error);
        this.mensaje = 'Hubo un problema al enviar la solicitud. Inténtalo de nuevo.';
      },
    });

    this.volverTienda();
  }
}
