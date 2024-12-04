// export interface DetallePedidoDTO {
//   cantidad: number;
//   precioUnitario: number;
//   productoId: number;
//   varianteProductoId: number | null;
// }

// export interface EnvioDTO {
//   direccion: string;
//   ciudad: string;
//   provincia: string;
//   codigoPostal: string;
//   fechaEstimada: string;
// }

// export interface RetiroDTO {
//   puntoRetiro: string;
//   nombreRetira: string;
//   documentoRetira: string;
//   fechaRetiro: string;
// }

// export interface PedidoDTO {
//   id: number;
//   estado: string;
//   total: number;
//   metodoPago: string;
//   fechaCreacion: string;
//   fechaActualizacion: string;
//   esEnvio: boolean;
//   detalles: DetallePedidoDTO[];
//   envio?: EnvioDTO | null;
//   retiro?: RetiroDTO | null;
// }

// export interface PedidoCreacionDTO {
//   estado: string;
//   total: number;
//   metodoPago: string;
//   fechaCreacion: string;
//   fechaActualizacion: string;
//   esEnvio: boolean;
//   usuarioId: string;
//   detalles: DetallePedidoDTO[];
//   envio?: EnvioDTO | null;
//   retiro?: RetiroDTO | null;
// }

export class Pedido {
  id: number;
  estado: string;
  total: number;
  metodoPago: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  esEnvio: boolean;
  usuarioId: string;
  detalles: DetallePedido[];
  envio?: Envio;
  retiro?: Retiro;

  constructor(
    id: number,
    estado: string,
    total: number,
    metodoPago: string,
    fechaCreacion: Date,
    fechaActualizacion: Date,
    esEnvio: boolean,
    usuarioId: string,
    detalles: DetallePedido[],
    envio?: Envio,
    retiro?: Retiro
  ) {
    this.id = id;
    this.estado = estado;
    this.total = total;
    this.metodoPago = metodoPago;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
    this.esEnvio = esEnvio;
    this.usuarioId = usuarioId;
    this.detalles = detalles;
    this.envio = envio;
    this.retiro = retiro;
  }
}

export class DetallePedido {
  cantidad: number;
  precioUnitario: number;
  productoId: number;
  varianteProductoId?: number;

  constructor(
    cantidad: number,
    precioUnitario: number,
    productoId: number,
    varianteProductoId?: number
  ) {
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.productoId = productoId;
    this.varianteProductoId = varianteProductoId;
  }
}

export class Envio {
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  fechaEstimada: Date;

  constructor(
    direccion: string,
    ciudad: string,
    provincia: string,
    codigoPostal: string,
    fechaEstimada: Date
  ) {
    this.direccion = direccion;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.codigoPostal = codigoPostal;
    this.fechaEstimada = fechaEstimada;
  }
}

export class Retiro {
  puntoRetiro: string;
  nombreRetira: string;
  documentoRetira: string;
  fechaRetiro: Date;

  constructor(
    puntoRetiro: string,
    nombreRetira: string,
    documentoRetira: string,
    fechaRetiro: Date
  ) {
    this.puntoRetiro = puntoRetiro;
    this.nombreRetira = nombreRetira;
    this.documentoRetira = documentoRetira;
    this.fechaRetiro = fechaRetiro;
  }
}