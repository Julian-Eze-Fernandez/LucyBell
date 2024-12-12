import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-email',
  standalone: true,
  imports: [],
  templateUrl: './confirmar-email.component.html',
  styleUrl: './confirmar-email.component.css'
})

export class ConfirmarEmailComponent {

  constructor(
    private router: Router
  ) {}

  NavegarTienda(): void {
    this.router.navigate(['']);
  } 
}
