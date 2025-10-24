export function helper(dato, comentarios = []) {
    const fecha = new Date().toLocaleString();

    const nuevoComentario = {
        fecha,
        nombre: dato.nombreCompleto,
        dni: dato.dni,
        razon: dato.razon,
        comentario: dato.comentario
    }
    comentarios.push(nuevoComentario);
    return comentarios;
}


