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
import { ResumenCompraComponent } from './Pages/resumen-compra/resumen-compra.component';
import { FooterComponent } from './Pages/Components/footer/footer.component';
import { VentasActivasComponent } from './Pages/ventas-activas/ventas-activas.component';
import { MetricasComponent } from './Pages/metricas/metricas.component';
import { SobreMiComponent } from './Pages/sobre-mi/sobre-mi.component';
import { ConfirmarEmailComponent } from './Pages/confirmar-email/confirmar-email.component';
import { RestablecerContrasenaComponent } from './Pages/restablecer-contrasena/restablecer-contrasena.component';
import { RestablecerContrasenaSolicitudComponent } from './Pages/restablecer-contrasena-solicitud/restablecer-contrasena-solicitud.component';
import { HistorialVentasComponent } from './Pages/historial-ventas/historial-ventas.component';
import { PerfilComponent } from './Pages/perfil/perfil.component';

register();


@NgModule({
  declarations: [

    
  
  ],
  imports: [
    PerfilComponent,
    MetricasComponent,
    SobreMiComponent,
    VentasActivasComponent,
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
    FormularioRegistroComponent,
    IndiceUsuariosComponent,
    ListadoGenericoComponent,
    ContactoComponent,
    ProductosComponent,
    NavBarResponsiveComponent,
    CarritoComponent,
    ProductoComponent,
    ResumenCompraComponent,
    HistorialVentasComponent
    ResumenCompraComponent,
    ConfirmarEmailComponent,
    RestablecerContrasenaComponent,
    RestablecerContrasenaSolicitudComponent
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
