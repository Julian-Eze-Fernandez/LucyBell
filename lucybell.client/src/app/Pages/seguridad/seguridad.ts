export interface CredencialesUsuarioDTO {
    email: string;
    password: string;
}

export interface RespuestaAutenticacionDTO{
    token: string;
    expiracion: Date;
}

export interface CredencialesUsuarioCreacionDTO {
    nombre: string;
    email: string;
    password: string;
    telefono: string;
}

export interface UsuarioDTO {
    nombre: string;
    email: string;
    telefono: string;
}