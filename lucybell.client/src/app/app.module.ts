import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TwoButtonModalComponent } from './Pages/two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from './Pages/one-button-modal/one-button-modal.component';
import { SidebarAdminComponent } from './Pages/sidebarAdmin/sidebarAdmin.component';
import { RouterModule } from '@angular/router';
import { AgregarProductoComponent } from './Pages/agregar-producto/agregar-producto.component';
import { AdministrarProductosComponent } from './Pages/administrar-productos/administrar-productos.component';
import { EditProductoComponent } from './Pages/edit-producto/edit-producto.component';
import { StockComponent } from './Pages/stock/stock.component';
import { navBarComponent } from './Pages/navBar/navBar.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { register } from 'swiper/element/bundle';
import { AutorizadoComponent } from './Pages/seguridad/autorizado/autorizado.component';
import { LoginComponent } from './Pages/seguridad/login/login.component';
import { FormularioAutenticacionComponent } from './Pages/seguridad/formulario-autenticacion/formulario-autenticacion.component';
import { MostrarErroresComponent } from './Pages/seguridad/mostrar-errores/mostrar-errores.component';
import { RegistroComponent } from './Pages/seguridad/registro/registro.component';
import { FormularioRegistroComponent } from './Pages/seguridad/formulario-registro/formulario-registro.component';
import { IndiceUsuariosComponent } from './Pages/seguridad/indice-usuarios/indice-usuarios.component';
import { ListadoGenericoComponent } from './Pages/seguridad/compartidos/componentes/listado-generico/listado-generico.component';
import { SidebarComponent } from './Pages/sidebar/sidebar.component';
import { ContactoComponent } from './Pages/contacto/contacto.component';
import { ProductosComponent } from './Pages/productos/productos.component';

register();


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
    SidebarAdminComponent,
    AppRoutingModule,
    RouterModule,
    StockComponent,
    navBarComponent,
    InicioComponent ,
    AutorizadoComponent,
    LoginComponent,
    FormularioAutenticacionComponent,
    MostrarErroresComponent,
    RegistroComponent,
    FormularioRegistroComponent,
    IndiceUsuariosComponent,
    ListadoGenericoComponent,
    ContactoComponent,
    ProductosComponent
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
