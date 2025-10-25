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

function dnis(lista = []) {
    return lista.map(item => ({
        nombreCompleto: item.NombreCompleto,
        dnis: item.DNI
    }))
}

function jsonReporte(reporte, datoEnfermeras = [], datosTecnicas = []) {
    return {
        idReporte: reporte.IdReporteEnfermera,
        encargadaNombre: reporte.NombreCompleto,
        encargadaDni: reporte.DniEmpleado,
        turno: reporte.Turno,
        codigo: reporte.Codigo,
        fechaHora: reporte.FechaHora,
        enfermerasTurno: datoEnfermeras,
        tecnicasTurno: datosTecnicas,
        datosReporte: reporte.Reporte,
        observaciones: reporte.Observacion,
        comentarios: reporte.Comentarios
    }
}


module.exports = {
    helper,
    dnis,
    jsonReporte
};