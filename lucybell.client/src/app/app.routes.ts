import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './Pages/categorias/categorias.component';
import { SidebarAdminComponent } from './Pages/Components/sidebarAdmin/sidebarAdmin.component';
import { AgregarProductoComponent } from './Pages/Components/agregar-producto/agregar-producto.component'
import { AdministrarProductosComponent } from './Pages/administrar-productos/administrar-productos.component'
import { EditProductoComponent } from './Pages/Components/edit-producto/edit-producto.component'
import { StockComponent } from './Pages/stock/stock.component'
import { navBarComponent } from './Pages/Components/navBar/navBar.component';
import { InicioComponent } from './Pages/inicio/inicio.component'
import { Component } from '@angular/core';
import { esAdminGuard } from './Pages/seguridad/compartidos/guards/es-admin.guard';
import { IndiceUsuariosComponent } from './Pages/seguridad/indice-usuarios/indice-usuarios.component';
import { ContactoComponent } from './Pages/contacto/contacto.component';
import { ProductosComponent } from './Pages/productos/productos.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentasActivasComponent } from './Pages/ventas-activas/ventas-activas.component';
import { MetricasComponent } from './Pages/metricas/metricas.component';
import { SobreMiComponent } from './Pages/sobre-mi/sobre-mi.component';
import { ResumenCompraComponent } from './Pages/resumen-compra/resumen-compra.component';

export const routes: Routes = [
    { path: '',component:InicioComponent  },
    { path: 'categorias',component:CategoriasComponent, canActivate: [esAdminGuard]},
    { path: 'sidebarAdmin', component: SidebarAdminComponent, canActivate: [esAdminGuard]},
    { path: 'agregarProducto', component: AgregarProductoComponent, canActivate: [esAdminGuard]},
    { path: 'administrarProductos', component: AdministrarProductosComponent, canActivate: [esAdminGuard]},
    { path: 'editarProducto/:id', component:EditProductoComponent, canActivate: [esAdminGuard]},
    { path: 'stock', component:StockComponent, canActivate: [esAdminGuard]},
    { path: 'metricas', component: MetricasComponent, canActivate: [esAdminGuard]},
    { path: 'navBar', component: navBarComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'usuarios', component: IndiceUsuariosComponent},
    { path: 'contacto', component: ContactoComponent},
    { path: 'productos', component: ProductosComponent},
    { path: 'productos/:id', component: ProductoComponent},
    { path: 'ventasActivas', component: VentasActivasComponent},
    { path: 'sobre-mi', component: SobreMiComponent},

    { path: 'resumenCompra', component: ResumenCompraComponent},
];



