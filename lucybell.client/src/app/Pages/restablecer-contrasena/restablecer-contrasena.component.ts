import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguridadService } from '../../Services/seguridad.service';

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restablecer-contrasena.component.html',
  styleUrl: './restablecer-contrasena.component.css'
})

export class RestablecerContrasenaComponent implements OnInit {
  formulario: FormGroup;
  token: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private seguridadService: SeguridadService, // Inyectamos el servicio de seguridad
    private router: Router
  ) {
    this.formulario = this.fb.group(
      {
        nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
        repetirPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsCoinciden } // Aquí se aplica la validación personalizada
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] ? decodeURIComponent(params['token']) : null;
      this.email = params['email'];
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid || !this.token || !this.email) {
      alert('Faltan datos necesarios para restablecer la contraseña.');
      return;
    }
  
    const restablecerData = {
      email: this.email,
      token: this.token,
      nuevaContrasena: this.formulario.value.nuevaPassword
    };
  
    console.log(restablecerData);
  
    this.seguridadService.restablecerContrasena(restablecerData).subscribe({
      next: () => {
        alert('Contraseña restablecida correctamente.');
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error(error);
        alert('Error al restablecer la contraseña.');
      }
    });
  }

  passwordsCoinciden(formGroup: any) {
    const password = formGroup.get('nuevaPassword').value;
    const repetirPassword = formGroup.get('repetirPassword').value;

    return password === repetirPassword ? null : { noCoinciden: true };
  }
}