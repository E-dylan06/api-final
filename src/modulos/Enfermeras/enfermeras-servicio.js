const db = require('./enfermeras-dao.js');
const helper = require('./helper.js')

function getAllTables(pagina) {
    return db.getAllTables(pagina);
}


function createReport(reporte) {
    return db.createReport(reporte)
}


async function modifyReport(dato) {
    let comentarios = [];

    const contenido = await db.bringsComments(dato.idReporte);
    if (contenido.length > 0 && contenido[0].Comentarios) {
        comentarios = JSON.parse(contenido[0].Comentarios);
    }
    const empleado = parseInt(await db.searchUserWeb(dato.idWeb));
    const datosEmpleado = await db.searchForWorker(empleado);
    const comentariosNuevos = helper.helper(dato, comentarios, datosEmpleado);
    await db.update(dato.idReporte, JSON.stringify(comentariosNuevos));

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
    const reporte = await db.searchById(id);
    if (!reporte) {
        const error = new Error(`El reporte con ID '${id}' no existe.`);
        error.status = 404;
        throw error;
    }
    const listaDNIEnfermeras = JSON.parse(reporte.EnfermerasTurno).map(e => e.dni);
    const listaDNITecnicos = JSON.parse(reporte.TecnicosTurno).map(t => t.dni);

    const enfermeras = await db.searchEnfermeras(listaDNIEnfermeras);
    const tecnicos = await db.searchTecnicos(listaDNITecnicos);
    const listaEnfermeras = helper.dnis(enfermeras);
    const listaTecnicos = helper.dnis(tecnicos);

    const resultado = helper.jsonReporte(reporte, listaEnfermeras, listaTecnicos);
    return resultado;
}


async function getFilteredTables(datos) {
    // Extraer paginación
    const pagina = parseInt(datos.pagina) || 1;
    const tamanoPagina = parseInt(datos.tamanoPagina) || 10;

    // Extraer y limpiar filtros
    const filtros = {};
    if (datos.codigo) filtros.codigo = datos.codigo;
    if (datos.fechaInicial) filtros.fechaInicial = datos.fechaInicial;
    if (datos.fechaFinal) filtros.fechaFinal = datos.fechaFinal;
    if (datos.enfermera) filtros.enfermera = parseInt(datos.enfermera);

    return db.getFilteredTables(pagina, tamanoPagina, filtros);
}


function getNurses() {
    return db.getNurses();
}
module.exports = {
    createReport,
    getAllTables,
    modifyReport,
    searchByCode,
    searchById,
    getFilteredTables,
    getNurses
}