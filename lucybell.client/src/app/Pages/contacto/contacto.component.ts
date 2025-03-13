import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { navBarComponent } from "../Components/navBar/navBar.component";
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../Components/sidebar/sidebar.component';
import { NavBarResponsiveComponent } from "../Components/nav-bar-responsive/nav-bar-responsive.component";
import { FooterComponent } from '../Components/footer/footer.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [navBarComponent, CommonModule, NavBarResponsiveComponent, FooterComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements OnInit {
  isLargeScreen: boolean = true;
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  ngOnInit() {
    this.checkScreenSize();
   }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); 
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
  }

  toggleChildSidebar(): void {
    this.sidebar.toggleSidebar();
  }
}
