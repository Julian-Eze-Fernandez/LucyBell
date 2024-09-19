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
export const routes: Routes = [
    { path: '',component:CategoriasComponent  },
    { path: 'categorias',component:CategoriasComponent },
    { path: 'sidebar', component: SidebarComponent },
    { path: 'agregarProducto', component: AgregarProductoComponent },
    { path: 'administrarProductos', component: AdministrarProductosComponent },
    { path: 'editarProducto/:id', component:EditProductoComponent  },
    { path: 'stock', component:StockComponent},
    { path: 'navBar', component: navBarComponent },
    { path: 'inicio', component: InicioComponent }
];



