import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginacionDTO } from '../compartidos/modelos/PaginacionDTO';
import { UsuarioDTO } from '../seguridad';
import { SeguridadService } from '../../../Services/seguridad.service';
import { ListadoGenericoComponent } from "../compartidos/componentes/listado-generico/listado-generico.component";
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from "../../sidebarAdmin/sidebarAdmin.component";

@Component({
  selector: 'app-indice-usuarios',
  standalone: true,
  imports: [RouterLink, ListadoGenericoComponent, CommonModule, SidebarAdminComponent],
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
    this.paginacion.pagina = datos.pageIndex + 1;  // Aumentamos el índice de página
    this.paginacion.recordsPorPagina = datos.pageSize;  // Actualizamos los registros por página

    // Cargamos los registros de acuerdo a la nueva configuración
    this.cargarRegistros();
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

