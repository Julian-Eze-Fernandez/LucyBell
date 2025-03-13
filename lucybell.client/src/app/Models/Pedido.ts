export interface DetallePedidoDTO {
  cantidad: number;
  precioUnitario: number;
  productoId: number;
  varianteProductoId: number | null;
}

export interface EnvioDTO {
  direccion: string;
  barrio: string;
  codigoPostal: string;
  observacion: string;
  fechaEstimada: string;
}

export interface RetiroDTO {
  puntoRetiro: string;
  nombreRetira: string;
  documentoRetira: string;
  fechaRetiro: string;
}

export interface PedidoDTO {
  id: number;
  estado: string;
  total: number;
  metodoPago: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  esEnvio: boolean;
  detalles: DetallePedidoDTO[];
  envio?: EnvioDTO | null;
  retiro?: RetiroDTO | null;
}

export interface PedidoCreacionDTO {
  estado: string;
  total: number;
  metodoPago: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  esEnvio: boolean;
  usuarioId: string;
  detalles: DetallePedidoDTO[];
  envio?: EnvioDTO | null;
  retiro?: RetiroDTO | null;
}