import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TwoButtonModalComponent } from './Pages/Components/two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from './Pages/Components/one-button-modal/one-button-modal.component';
import { SidebarAdminComponent } from './Pages/Components/sidebarAdmin/sidebarAdmin.component';
import { RouterModule } from '@angular/router';
import { AgregarProductoComponent } from './Pages/Components/agregar-producto/agregar-producto.component';
import { AdministrarProductosComponent } from './Pages/administrar-productos/administrar-productos.component';
import { EditProductoComponent } from './Pages/Components/edit-producto/edit-producto.component';
import { StockComponent } from './Pages/stock/stock.component';
import { navBarComponent } from './Pages/Components/navBar/navBar.component';
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
import { SidebarComponent } from './Pages/Components/sidebar/sidebar.component';
import { ContactoComponent } from './Pages/contacto/contacto.component';
import { ProductosComponent } from './Pages/productos/productos.component';
import { NavBarResponsiveComponent } from './Pages/Components/nav-bar-responsive/nav-bar-responsive.component';
import { CarritoComponent } from './Pages/Components/carrito/carrito.component';
import { DestacadosComponent } from './Pages/Components/destacados/destacados.component';
import { ListaProductosComponent } from './Pages/Components/lista-productos/lista-productos.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { FooterComponent } from './Pages/Components/footer/footer.component';

register();


@NgModule({
  declarations: [

    
  
    
  ],
  imports: [
    FooterComponent,
    ListaProductosComponent,
    DestacadosComponent,
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
    ProductosComponent,
    NavBarResponsiveComponent,
    CarritoComponent,
    ProductoComponent
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
