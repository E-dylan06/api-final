const db = require('./enfermeras-dao.js');
const helper = require('./helper.js')

function getAllTables() {
    return db.getAllTables();
}


    function createReport(reporte) {
        return db.createReport(reporte)
    }


async function modifyReport(dato) {
    let comentarios = [];

    const contenido = await db.bringsComments(dato.id);

    if (contenido.length > 0 && contenido[0].Comentarios) {
        comentarios = JSON.parse(contenido[0].Comentarios);
    }

    const comentariosNuevos = helper.helper(dato, comentarios);

    await db.update(dato.id, JSON.stringify(comentariosNuevos));

    return {
        mensaje: "✅ Comentario agregado correctamente",
        totalComentarios: comentariosNuevos.length
    };
}


async function searchByCode(codigo) {
    const data = await db.searchByCode(codigo)
    if (!data || !data.reporte) {
        const error = new Error(`El código '${codigo}' no existe o es inválido.`);
        error.status = 404; // Código HTTP 404 Not Found
        throw error;
    }
    return data;
}

async function searchById(id) {
    // 1️⃣ Obtener datos generales del reporte
    const reporte = await dao.searchById(id);
    if (!reporte) {
        const error = new Error(`El reporte con ID '${id}' no existe.`);
        error.status = 404;
        throw error;
    }

    // 2️⃣ Convertir los arrays de DNIs a objetos
    const listaDNIEnfermeras = JSON.parse(reporte.EnfermerasTurno || '[]');
    const listaDNITecnicos = JSON.parse(reporte.TecnicosTurno || '[]');

    const enfermeras = await dao.searchEnfermeras(listaDNIEnfermeras);
    const tecnicos = await dao.searchTecnicos(listaDNITecnicos);

    // 3️⃣ Aplicar helper para estandarizar
    const listaEnfermeras = mapDNIsToObjects(enfermeras);
    const listaTecnicos = mapDNIsToObjects(tecnicos);

    // 4️⃣ Armar el JSON final
    return {
        idReporte: reporte.IdReporteEnfermera,
        codigo: reporte.Codigo,
        fechaHora: reporte.FechaHora,
        turno: reporte.Turno,
        empleado: {
            nombreCompleto: reporte.NombreCompleto,
            dni: reporte.DNI
        },
        Enfermeras: listaEnfermeras,
        Tecnicos: listaTecnicos,
        reporte: reporte.Reporte,
        observacion: reporte.Observacion,
        comentarios: JSON.parse(reporte.Comentarios || '[]')
    };
}








module.exports = {
    createReport,
    getAllTables,
    modifyReport,
    searchByCode,
    searchById
}