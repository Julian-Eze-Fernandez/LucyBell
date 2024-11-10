import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredencialesUsuarioDTO } from '../seguridad';
import { CommonModule } from '@angular/common';
import { MostrarErroresComponent } from "../mostrar-errores/mostrar-errores.component";

@Component({
  selector: 'app-formulario-autenticacion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MostrarErroresComponent],
  templateUrl: './formulario-autenticacion.component.html',
  styleUrl: './formulario-autenticacion.component.css'
})
export class FormularioAutenticacionComponent {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', {validators: [Validators.required, Validators.email]}],
    password: ['', {validators: [Validators.required]}]
  })

  @Input({required: true})
  titulo!: string;

  @Input()
  errores: string[] = [];

  @Output()
  posteoFormulario = new EventEmitter<CredencialesUsuarioDTO>();

  obtenerMensajeErrorEmail(): string{
    let campo = this.form.controls.email;

    if (campo.hasError('required')) {
      return 'El campo email es requerido';      
    }

    if (campo.hasError('email')) {
      return 'El email no es valido';      
    }

    return '';
  }

  obtenerMensajeErrorPassword(): string{
    let campo = this.form.controls.password;

    if (campo.hasError('required')) {
      return 'El campo contraseña es requerido';      
    }

    return '';
  }

  guardarCambios(){
    if (!this.form.valid) {
      return;
    }

    const credenciales = this.form.value as CredencialesUsuarioDTO;
    this.posteoFormulario.emit(credenciales);
  }

}
