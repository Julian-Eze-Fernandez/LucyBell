import { Component, inject, Input } from '@angular/core';
import { SeguridadService } from '../../../Services/seguridad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-autorizado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './autorizado.component.html',
  styleUrl: './autorizado.component.css'
})
export class AutorizadoComponent {
  seguridadService = inject(SeguridadService);
  @Input()
  rol?: string;


  estaAutorizado(): boolean{
    if (this.rol) {
      return this.seguridadService.obtenerRol() === this.rol;
    } else {
      return this.seguridadService.estaLogueado();
    }
  }
}
