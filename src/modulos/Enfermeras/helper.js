function helper(dato, comentarios = []) {
    const fecha = new Date().toLocaleString();

    const nuevoComentario = {
        fecha,
        nombre: dato.nombreCompleto,
        dni: dato.dni,
        razon: dato.razon,
        comentario: dato.comentario
    };
    comentarios.push(nuevoComentario);
    return comentarios;
}


function mapDNIsToObjects(lista = []) {
    return lista.map(item => ({
        nombreCompleto: item.NombreCompleto,
        dni: item.DNI
    }));
}

module.exports = {
    helper,
    mapDNIsToObjects
};