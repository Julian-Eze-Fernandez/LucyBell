import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navBarComponent } from '../navBar/navBar.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, navBarComponent,],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
