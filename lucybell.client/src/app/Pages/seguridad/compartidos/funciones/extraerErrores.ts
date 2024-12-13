export function extraerErroresIdentity(obj: any): string[] {
    let mensajesDeError: string[] = [];
  
    if (obj.error) {
      if (typeof obj.error === 'string') {
        mensajesDeError.push(obj.error);
      } else if (obj.error.errors && Array.isArray(obj.error.errors)) {
        mensajesDeError = obj.error.errors;
      } else if (obj.error.mensaje) {
        mensajesDeError.push(obj.error.mensaje);
      }
    }
  
    return mensajesDeError;
  }