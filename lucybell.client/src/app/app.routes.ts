import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { CategoriaComponent } from './Pages/categoria/categoria.component';
import { SidebarComponent } from './Pages/sidebar/sidebar.component';
import { AgregarProductoComponent } from './Pages/agregar-producto/agregar-producto.component'
import { AdministrarProductosComponent } from './Pages/administrar-productos/administrar-productos.component'
import { Component } from '@angular/core';
export const routes: Routes = [
    { path:'',component:InicioComponent },
    { path:'inicio',component:InicioComponent },
    { path:'sidebar', component: SidebarComponent },
    { path: 'categoria/:id', component: CategoriaComponent },
    { path: 'agregarProducto', component: AgregarProductoComponent },
    { path: 'administrarProductos', component: AdministrarProductosComponent },
];



