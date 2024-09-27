import { Component, OnInit, ViewChild, OnChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProductoService } from '../../Services/producto.service';
import { CategoriaService } from '../../Services/categoria.service';
import {Producto} from '../../Models/Producto';
import {Categoria} from '../../Models/Categoria';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';

import { AgregarProductoComponent } from "../agregar-producto/agregar-producto.component";
import  {EditProductoComponent} from '../edit-producto/edit-producto.component';
import  {VariantesProductoService} from '../../Services/variantes-producto.service';
import { Validators } from '@angular/forms';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-administrar-productos',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TwoButtonModalComponent, AgregarProductoComponent, EditProductoComponent],
  templateUrl: './administrar-productos.component.html',
  styleUrl: './administrar-productos.component.css'
})
export class AdministrarProductosComponent implements OnInit {

  @ViewChild(AgregarProductoComponent) agregarProductoComponent!: AgregarProductoComponent;
  @ViewChild(EditProductoComponent) editProductoComponent!: EditProductoComponent;
  @ViewChild('addModalProd') addModalProd!: TwoButtonModalComponent;
  @ViewChild('deleteModalProd') deleteModalProd!: TwoButtonModalComponent;
  @ViewChild('editModalProd') editModalProd!: TwoButtonModalComponent;

  productos: Producto[] = [];
  selectedProducto: Producto | null = null;
  categorias: Categoria[] = []
  categoriasMap: { [id: number]: string } = {};
  showModal: boolean = false;
  isSuccess: boolean = false;
  initialFormValues: any;

  customIconDelete = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <rect width="35" height="35" fill="url(#pattern0_830_4)"/>
                        <defs>
                          <pattern id="pattern0_830_4" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image0_830_4" transform="scale(0.01)"/>
                          </pattern>
                          <image id="image0_830_4" width="100" height="100" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACtElEQVR4nO2dPYsTURiFHz9ALey0EhdZ8C+ohYggiP0iopXaWYggLDYWLxaLhZ02FmKnIFsLoqCFP8FyFwVFsLARRBYWrwyOIOLNJnESzn09D7xNCDM55xkyNyTkgjHGGGOMMcYYY4wxZlbsB84By8CNKeYycNh6/p09wD1gAygDzFNgwWKmYxfweiARv88nYNFSJmdlBjJ+TSfaTMBu4MsMhXRzzEbG58SMZXRz00LG50KlxG/A8wnnY+VY9y1kfC5WSnw7RYkPK8fqHjcWMj929svJIWa5clW/n+JYq5VjrQ74evciyKE53IiL6HRvsXJYiBgWIoaFiGEhYliI+LK3tiI5P+Byc3EOM04OyWXvn9SCnKQtSpIcaYKUJDnSBClJcqQJUpLkSBOkJMmRJkhJkiNNkJIkR5ogJUmOiYMcr/zIrfsAVqP2w7iFAc/x3wqJyvNfNnYOWRTLCgvRKissRKussBCtssJCtMoKC9EqKyxEq6ywEK2ywkK0ygoL0SorLESrrLAQrbLCQrTKCgvRKissRKussBCtssJCtMoKC9EqKyxEq6ywEK2ywkK0ygoL0SorLESrrLAQrbLCQrTKCgvRKissRKussBCtssJCtMoKC9EqKyxEq6ywEK2ywkLGL+sasP6XeTRCyHpljg54jkmly5IlSEmSI02QkiRHmiAlSY40QUqSHGmClCQ50gQpSXLwtRJkiXbYN0LIERpjLcF/rl8aIeQAjfG4EuQ7cB3Yjjangc+VDB+AbTTG2RFXV+nDvppi+4lZzwvg3Rav/S4NsgN4s0Ww0uBstLyH1SlgU6DEMuA0vzPP1f6+URLMkxbvHbUtjGrL4NLAdBfUnf5tOA0HgQeNidkEnrX4mWPS3TvPAFeAW8BtsVnpvzdZ6rd8NcYYY4wxxhhjjDHG8JMfT2SLuEV5t3oAAAAASUVORK5CYII="/>
                        </defs>
                      </svg>`;
  customIconAdd = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="35" height="35" fill="url(#pattern0_1031_10)"/>
                    <defs>
                      <pattern id="pattern0_1031_10" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlink:href="#image0_1031_10" transform="scale(0.01)"/>
                      </pattern>
                      <image id="image0_1031_10" width="100" height="100" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAG1ElEQVR4nO2dXWxVRRDH/7flQVrok2CiQQ8+SUqRiCRqaK0NCjHxIzH6ZFJBSRQ0ivimaaIoCMRnbfADpQVLjB98+CCRKBAFifUDP/BFxQ/0Aaw2vbTVtseMGRLTsHPOuffs7pzb/SWbkHvp7uzOPbszs7N7gEAgEAgEAoFAIBAISFwKYCmA1QC6AGwC0A2gl0s3f9bF/4f+7xyxxkBqGgEs5wE+CmAIQFxhob89wnUt47oDKWgCsBLAAQB/V6GApEJ1vw9gBbcZmMT1AHYAOGtRCaZS5umuLWgFWMK/1FhJOQzgFgClqfhEfKpAAbGhHAPQiinARQBeAzBR5YD9DOBDAHsB9LF11c3/3sff/VJlGyTjNgCzUaPQYj1QwcD8CmA7//1VAGZkaHMmgEUA7gXQw3Vlbf8PAJ2oIWbwgGYZhO8BPAVgngV5mgGsB/BjRplerQVzuQXAiQxTxFts7bhYVKmNdgDvZJhCv2GFFpIOAIMpOjnO00mz5x/OTpYlSd4/WZGF4nYAwyk61w/gGuhhEUcFkuQeAXAXCsJ9AMZShDLWAKiHPuoBPMQOo9SHMTY01D8ZYynmYZoitHMFgC9TTLd3QvGaMZLQAbLrp6M4NLDfJPVpWOOaQr/4vxIEJ1OziJQAbEix0Ddr8jNOJDzWD6L4PJxghX2txU9JeqQfQe2wOqGvFLH2ysoanaYkkqavTp+BQik29Qpqk1JCKOgMgFnapqqv2EKpVRp5zTD1/2Uf+xkTgtNnIyh4Pup4jaL98o/YoaPPXDBfcB4nePPN2SMrbS6RB+5zPl/v2PIyjQOFYJxwc8JOm6twSL1hD77sWIbPhPG4yYUQhwV/YzHc5mjFhkLfueJawT+hnUvra4dpECiE7pJIkIW+c0mfIIvVvfkdwiJGi9xUVciVgpFDJrIVmgSr4k24J1KkEGK3QZYy7+079cp9JJlFyhTSLshzj40GDwgJCT4SyyJlCqkTEif22/BMRw2NPQk/RMoUQjxjkGc070jwcqHzrrzyIihkviDTjXk2tMnQCCWe+SJSqBAIyXgUVciNo65NugIrxOQafJxXAyXhsAylaPoiUqqQVQaZBvMyfuYIHadcW19EShWyWJDr4jwaWGqofMKWw1NwhTQJct1gcx+Z0v19EilVCHHKINf9eVTeZaj8YA51U47WXACXV1DaBIW0VVjn3JzyxkwR8SdyqBtbDJXTYZlq9hGeS5n/Gzsuw9znanYe9xnq3owceN5QOWWLV8pjCgY+Tijrqujf64Y6aSyrpsdQ+dYq6pR22WIlhTLzK2WrzT0jGwrpVzDgcUKhvAGVCrExZa1TMOBxUacsG4t6HderdVHfrHlRN5m9h3Ko+wL2GbSYvRHLpNrsDY6hMscwhE6UhU5CcFFZcDGE35WF38HJzBqS44oQXNxpkImSwa1v4dLi5YtIoULoCfjNxRbuMqHzvg47RgoV0uIqyaFBSAPydWwtUqiQjQZ5Rm0cYDLd/PZDSJT7D/LsTxrG6D1YYIXwi/RxcD5S9oR0uD4IKiVbvw33RMoUstcgy5DN3INeIeGhZQorZKFwHIEOx1pDCuhVE44vukLeEGSxfvjzkKHhccd3X10mDAJ954olwtPxgQsBpMTrfocHLqcb9lPO5hRCT8M0AF+48j0kjglC0FlxV2yxtQmUkrXCOFC4yRmtwmNadui91/FWaz+XRx1eHLBAuBqdxuY6OGab8Ov4znOaqW0a+WY8U/9fhAdm8yXDsWDu1eId6iXhyAGV0wAu9CVcpyBY7hFOJZgi3+fK3b4FlKaumBe+WmFNQl+9TFVZ59NxvqSl6KxNuAH7uKYrqZr5Isik6auIa0opxTQ14PHwq5H2FIlv27VcFJnhgk9pAY+5z2rfznMrgH8SOvAt2/DamcfTkNQXujT6DihnZYrbrcu8rmi8anwarxdJ78Mas3Vlhg1uS/mCr899eLQJgUIpNnWujGi+YlxaU5IW+pgtlz6+4sgXCzmEnuY9IgOa14w01pd0e+dkxexmRbqIR9XxtuueDC90Oa7RmspKYwrncXI5CeBpS5eiLWAT/KeMMr2kyc/IK8xyJuMgxJx41sspmldnfDNnE+faruIdzd8raP+0hnCILWbxjdfVvjbvFB/LfhfArv+9Nm8Xf3ZQyCBMWyY4FOItUOjamvmkygGLLZYjyqw/p4rZo0AB8aRXr055WjmTvuxBCUMc0nF2NXiRmMne7/4Ur0+qpoxwemdnxjeHTmkaOGtjI1/+leadiKYyyHVs4Dprynz1ySXszD3AJ1qfZeuqh8sL/NnjfMCyg/8mEAgEAoFAIBAIBAI4P/8CgOisw2+mNRgAAAAASUVORK5CYII="/>
                    </defs>
                    </svg>`;
  customIconEdit = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <rect width="35" height="35" fill="url(#pattern0_1031_11)"/>
                  <defs>
                    <pattern id="pattern0_1031_11" patternContentUnits="objectBoundingBox" width="1" height="1">
                     <use xlink:href="#image0_1031_11" transform="scale(0.01)"/>
                    </pattern>
                    <image id="image0_1031_11" width="100" height="100" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADx0lEQVR4nO2dO4gUSRyHPy0f4MWaKSI+DhVBVMTAVcdEMBCzFZ/IiRyiiCCCiCsoCoKigokGCroLmxlorOhmKj6D45ITBMPz/UZHGmphGKa6u7pntsuu3weVVdd2/b/9b1V1d9WCEEIIIYQQQgghhBCiDswCdgBHgAvACWAvsAaYUPXNxcJkYD/wHGimlNfAVWBO1TdcZzYCLzJEtJdvwEVgStU3XyfGAYeAH54yWstjYGbVHakDBhgsIaK1vAJmVN2h313GtS7JGC2PgD+q7tjvKmMoR4D/BU4Bu4ADwE3ge8Y1yZgiuizjE/C3rdvOIuBBxkA/2+eGYsbkkPE/sCKjnWRWdSuljStj1J/ay3gHLM/ZXiLlfopULR5LykjGhlX4sdD+ierU3mrPtqLBeMymThdo/4ajrT096Es0s6lmS0meWfmwt0vt1B5TQEaRYG51tHG+h32LSkbTU8pxx/WHe9zHWsn4CAwAX0pKGQ/847h2+xj1txYyGrb++pJS9qRcF/3DRpNjNpXIWNsW1HXA5wKzr2W2vU71nxA5xjMz2vHNlOV28eequ4+IMQUzg4KZshJ4m1LnP/vmMUpMycwokilpT3t/AhuIFNOlzCiSKa5yjEgxXc6MIpnSXgbt6+DoMD3KjDKZMhzr013T48xo52gOGUOOF1m1x4xRZozSB7xXZnRGMgLCKDPCwUhGOBjJCAcjGeFgJCMcjGSEg5GMcDCSEQ6SERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERCSERiXc3yM/AE4CEws+bMaKXv6ov/weTQ7sj5Gbi3Pcpyy40IycjC/wA6j7/YcKh/69BV6PrYU3PbVtKe05dlt1NCfqfycKyEkKScz2u9TZvhxN2V714A9bDhLyk5H2w1lhh/j7elrnYK829aZClzPEPKtw0DfkAx//kwJ8tK2un9l7O1+2jIlbkhGMTY7gvvVcYrBhgwpByWjHGcdgX2Ycs2ujMXjRy36inPHEbxLGdcVPdZ7KNatx3kH9LcZA7qLaTlnX03JyM+8lOAtyXH9gIeM4VhPSPBhk+eAnjDJzr522yArM7rIGUdAk/PQsb/RC4Bt9mTOkQKn6wwrM/Jz2xHEl3aW5TrpWWNGD0geCL4pGXBlRheZKxlh0d8DIe/tm0dTdefqtEL3Cf6IHey32cFfIkow4hH8dx2CnywqRZeYmPK8ScGvgMU2+ImUe3Y90m//22WUhz9WzXQrRY8yhBBCCCGEEEIIIQRjzC/+K5V61K/KawAAAABJRU5ErkJggg=="/>
                  </defs>
                  </svg>`;

  tieneVariantes: boolean = false;

  constructor(private productoService: ProductoService, private categoriaService: CategoriaService, private VariantesProductoService: VariantesProductoService) { }

  ngOnInit(): void {
    this.cargarProductos()

  }

  

  cargarProductos(): void {
    this.productoService.GetProductoCompleto().subscribe((data: Producto[]) => {
      this.productos = data;
    });

  }

  openEditModal(producto: any): void {
    this.selectedProducto = producto;
    this.showModal = true;
    this.editModalProd.openModal();
  }

  closeEditModal(): void {
    this.selectedProducto = null;
    this.showModal = false;
    this.editModalProd.closeModal();
    this.editProductoComponent.limpiarForm();
  }

  onEdit(): void {
    if (this.editProductoComponent.productoForm.valid) {
      this.editProductoComponent.onSubmit().subscribe({
        next: (response) => {
          if (response) {
            this.closeEditModal();
            setTimeout(() => {
              this.cargarProductos();
            } , 200)
          }
        },
        error: (err) => {
          console.error('Error updating product:', err);
        }
      });
    }
  }


  getTotalStock(producto: Producto): number {
    return producto.variantesProducto.reduce((acc, variante) => acc + variante.cantidad, 0);
  }

  getCategoryName(id: number): string {
    return this.categoriasMap[id] || 'Desconocido';
  }

  openAddProdModal() {
    this.showModal = true;
    this.addModalProd.openModal();

  }
  closeAddProdModal() {
    this.showModal = false;
    this.addModalProd.closeModal();
    this.agregarProductoComponent.reiniciarForm();
    this.agregarProductoComponent.limpiarImgenes();
    this.cargarProductos();

  }

  openDeleteProdModal( categoria: any) {
    this.showModal = true;
    this.selectedProducto = categoria;
    this.deleteModalProd.openModal();

    if(this.selectedProducto?.variantesProducto.length == 0){
      this.tieneVariantes = true;
    }
  }
  closeDeleteProdModal() {
    this.deleteModalProd.closeModal();

    setTimeout(() => {
    this.tieneVariantes = false;
    this.selectedProducto = null;
    this.showModal = false;}, 200);
    
  }

  onDelete(): void { 
    if(this.selectedProducto){

      this.productoService.DeleteProducto(this.selectedProducto.id).subscribe({
        next: (response) => {
          if (response) {
            this.closeDeleteProdModal();
            this.cargarProductos();
          }
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      })
    }

  }

  onSubmitProd(){
    this.agregarProductoComponent.onSubmitProd()

    if(this.agregarProductoComponent.productoForm.valid){
    this.closeAddProdModal();  
    setTimeout(() => {
    this.cargarProductos();}, 200);
    }

  }

}
