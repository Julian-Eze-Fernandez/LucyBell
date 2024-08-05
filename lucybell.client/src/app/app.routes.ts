import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { CategoriaComponent } from './Pages/categoria/categoria.component';
import { SidebarComponent } from './Pages/sidebar/sidebar.component';
export const routes: Routes = [
    {path:'',component:InicioComponent},
    {path:'inicio',component:InicioComponent},
    {path:'sidebar', component: SidebarComponent },
    {path:'categoria/:id',component:CategoriaComponent},
];



