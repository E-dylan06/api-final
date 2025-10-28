function helper(dato, comentarios = [], datosEmpleado) {

    if (!datosEmpleado) {
        console.error("❌ Error en helper: datosEmpleado no fue encontrado.");
        console.log("Dato recibido:", dato);
        throw new Error("No se pudo obtener la información del empleado.");
    }

    const fecha = new Date().toLocaleString();

    const nuevoComentario = {
        fecha,
        nombre: datosEmpleado.nombreCompleto,
        dni: datosEmpleado.dni,
        idEmpleado: datosEmpleado.idEmpleado,
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
    const comentarios = reporte.Comentarios ? JSON.parse(reporte.Comentarios) : [];
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
        cantidadComentarios: comentarios.length,
        comentarios
    }
}


module.exports = {
    helper,
    dnis,
    jsonReporte
};