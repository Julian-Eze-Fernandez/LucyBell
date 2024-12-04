import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavBarResponsiveComponent } from '../Components/nav-bar-responsive/nav-bar-responsive.component';
import { navBarComponent } from '../Components/navBar/navBar.component';
import { FooterComponent } from '../Components/footer/footer.component';

@Component({
  selector: 'app-sobre-mi',
  standalone: true,
  imports: [CommonModule, navBarComponent, NavBarResponsiveComponent, FooterComponent],
  templateUrl: './sobre-mi.component.html',
  styleUrl: './sobre-mi.component.css'
})
export class SobreMiComponent implements OnInit {


  isLargeScreen: boolean = true;


  ngOnInit(): void {
    this.checkScreenSize();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }
}
