export function extraerErroresIdentity(obj: any): string[]{
    let mensajesDeError: string[] = [];

    for (let i = 0; i < obj.error.length; i++) {
        const elemento = obj.error[i];
        mensajesDeError.push(elemento.description);
        
    }

    return mensajesDeError;
}

  