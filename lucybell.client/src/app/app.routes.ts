import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './Pages/categorias/categorias.component';
import { SidebarComponent } from './Pages/sidebar/sidebar.component';
import { AgregarProductoComponent } from './Pages/agregar-producto/agregar-producto.component'
import { AdministrarProductosComponent } from './Pages/administrar-productos/administrar-productos.component'
import { EditProductoComponent } from './Pages/edit-producto/edit-producto.component'
import { StockComponent } from './Pages/stock/stock.component'
import { navBarComponent } from './Pages/navBar/navBar.component';
import { InicioComponent } from './Pages/inicio/inicio.component'
import { Component } from '@angular/core';
import { esAdminGuard } from './Pages/seguridad/compartidos/guards/es-admin.guard';
import { LoginComponent } from './Pages/seguridad/login/login.component';
import { RegistroComponent } from './Pages/seguridad/registro/registro.component';
import { IndiceUsuariosComponent } from './Pages/seguridad/indice-usuarios/indice-usuarios.component';
import { ContactoComponent } from './Pages/contacto/contacto.component';
export const routes: Routes = [
    { path: '',component:InicioComponent  },
    { path: 'categorias',component:CategoriasComponent, canActivate: [esAdminGuard]},
    { path: 'sidebar', component: SidebarComponent, canActivate: [esAdminGuard]},
    { path: 'agregarProducto', component: AgregarProductoComponent, canActivate: [esAdminGuard]},
    { path: 'administrarProductos', component: AdministrarProductosComponent, canActivate: [esAdminGuard]},
    { path: 'editarProducto/:id', component:EditProductoComponent, canActivate: [esAdminGuard]},
    { path: 'stock', component:StockComponent, canActivate: [esAdminGuard]},
    { path: 'navBar', component: navBarComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'usuarios', component: IndiceUsuariosComponent},
    { path: 'contacto', component: ContactoComponent},
];



