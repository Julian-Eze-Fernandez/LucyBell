import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TwoButtonModalComponent } from './Pages/two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from './Pages/one-button-modal/one-button-modal.component';
import { SidebarComponent } from './Pages/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { AgregarProductoComponent } from './Pages/agregar-producto/agregar-producto.component';
import { AdministrarProductosComponent } from './Pages/administrar-productos/administrar-productos.component';
import { EditProductoComponent } from './Pages/edit-producto/edit-producto.component';
import { StockComponent } from './Pages/stock/stock.component';
import { navBarComponent } from './Pages/navBar/navBar.component';
import { InicioComponent } from './Pages/inicio/inicio.component';


@NgModule({
  declarations: [

  
    
  
    
  
    
  
    
  ],
  imports: [
    AppComponent,
    TwoButtonModalComponent,
    OneButtonModalComponent,
    SidebarComponent,
    AgregarProductoComponent,
    AdministrarProductosComponent,
    EditProductoComponent,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    StockComponent,
    navBarComponent,
    InicioComponent 
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
