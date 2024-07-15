import { Routes } from '@angular/router';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { CategoriaComponent } from './Pages/categoria/categoria.component';

export const routes: Routes = [
    {path:'',component:InicioComponent},
    {path:'inicio',component:InicioComponent},
    {path:'categoria/:id',component:CategoriaComponent},
];
