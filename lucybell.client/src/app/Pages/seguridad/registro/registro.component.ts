import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SeguridadService } from '../../../Services/seguridad.service';
import { extraerErroresIdentity } from '../compartidos/funciones/extraerErrores';
import { CredencialesUsuarioDTO } from '../seguridad';
import { FormularioAutenticacionComponent } from "../formulario-autenticacion/formulario-autenticacion.component";
import { FormularioRegistroComponent } from "../formulario-registro/formulario-registro.component";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormularioAutenticacionComponent, FormularioRegistroComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  seguridadService = inject(SeguridadService);
  router = inject(Router);
  errores: string[] = [];

  registrar(credenciales: CredencialesUsuarioDTO){
    this.seguridadService.registrar(credenciales)
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
}
