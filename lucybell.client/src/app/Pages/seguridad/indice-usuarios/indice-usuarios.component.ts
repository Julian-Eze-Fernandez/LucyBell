import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginacionDTO } from '../compartidos/modelos/PaginacionDTO';
import { UsuarioDTO } from '../seguridad';
import { SeguridadService } from '../../../Services/seguridad.service';
import { ListadoGenericoComponent } from "../compartidos/componentes/listado-generico/listado-generico.component";
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: 'app-indice-usuarios',
  standalone: true,
  imports: [RouterLink, ListadoGenericoComponent, CommonModule, SidebarComponent],
  templateUrl: './indice-usuarios.component.html',
  styleUrls: ['./indice-usuarios.component.css'] // Cambié `styleUrl` a `styleUrls` para el plural
})
export class IndiceUsuariosComponent {
  columnasAMostrar = ['email', 'nombre', 'telefono', 'acciones'];
  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 10 };
  cantidadTotalRegistros!: number;

  usuarios!: UsuarioDTO[];

  servicioSeguridad = inject(SeguridadService);
  mensaje: string = '';

  constructor() {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.servicioSeguridad.obtenerUsuariosPaginado(this.paginacion)
      .subscribe(respuesta => {
        this.usuarios = respuesta.body as UsuarioDTO[];
        const cabecera = respuesta.headers.get("cantidad-total-registros") as string;
        this.cantidadTotalRegistros = parseInt(cabecera, 10);
      });
  }

  actualizarPaginacion(datos: { pageIndex: number; pageSize: number }) {
    // Establece la página directamente sin sumar 1
    this.paginacion.pagina = datos.pageIndex;  
    this.paginacion.recordsPorPagina = datos.pageSize;
  
    // Cargar los registros para la nueva configuración
    this.cargarRegistros();
  }
  
  irAPaginaAnterior() {
    if (this.paginacion.pagina > 1) {
      // Aquí, pageIndex será la página actual menos 1
      this.actualizarPaginacion({
        pageIndex: this.paginacion.pagina - 1,
        pageSize: this.paginacion.recordsPorPagina
      });
    }
  }

  hacerAdmin(email: string) {
    this.servicioSeguridad.hacerAdmin(email)
      .subscribe(() => {
        this.mensaje = `El usuario ${email} ahora es admin.`;
        setTimeout(() => this.mensaje = '', 5000); // Limpia el mensaje después de 5 segundos
      });
  }

  removerAdmin(email: string) {
    this.servicioSeguridad.removerAdmin(email)
      .subscribe(() => {
        this.mensaje = `El usuario ${email} ya no es admin.`;
        setTimeout(() => this.mensaje = '', 5000); // Limpia el mensaje después de 5 segundos
      });
  }
}

