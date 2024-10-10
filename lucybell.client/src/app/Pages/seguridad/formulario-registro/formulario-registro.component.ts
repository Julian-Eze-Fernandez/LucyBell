import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredencialesUsuarioCreacionDTO } from '../seguridad';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MostrarErroresComponent } from '../mostrar-errores/mostrar-errores.component';

@Component({
  selector: 'app-formulario-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MostrarErroresComponent],
  templateUrl: './formulario-registro.component.html',
  styleUrl: './formulario-registro.component.css'
})
export class FormularioRegistroComponent {
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    nombre: ['', {validators: [Validators.required]}],
    email: ['', {validators: [Validators.required, Validators.email]}],
    password: ['', {validators: [Validators.required]}],
    telefono: ['', {validators: [Validators.required]}]
  })

  @Input({required: true})
  titulo!: string;

  @Input()
  errores: string[] = [];

  @Output()
  posteoFormulario = new EventEmitter<CredencialesUsuarioCreacionDTO>();

  obtenerMensajeErrorNombre(): string{
    let campo = this.form.controls.nombre;

    if (campo.hasError('required')) {
      return 'El campo nombre es requerido';      
    }

    return '';
  }

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

  obtenerMensajeErrorTelefono(): string{
    let campo = this.form.controls.telefono;

    if (campo.hasError('required')) {
      return 'El campo telefono es requerido';      
    }

    return '';
  }

  guardarCambios(){
    if (!this.form.valid) {
      return;
    }

    const credenciales = this.form.value as CredencialesUsuarioCreacionDTO;
    this.posteoFormulario.emit(credenciales);
  }

}
