// export function extraerErroresIdentity(obj: any): string[]{
//     let mensajesDeError: string[] = [];

//     for (let i = 0; i < obj.error.length; i++) {
//         const elemento = obj.error[i];
//         mensajesDeError.push(elemento.description);
        
//     }

//     return mensajesDeError;
// }

export function extraerErroresIdentity(obj: any): string[] {
    let mensajesDeError: string[] = [];

    if (obj.error) {
        if (typeof obj.error === 'string') {
            mensajesDeError.push(obj.error);
        } else if (obj.error.mensaje) {
            // Captura el mensaje específico
            mensajesDeError.push(obj.error.mensaje);
        }
    } else if (obj.errors) {
        for (const error of obj.errors) {
            if (error.description) {
                mensajesDeError.push(error.description);
            }
        }
    }

    return mensajesDeError
}