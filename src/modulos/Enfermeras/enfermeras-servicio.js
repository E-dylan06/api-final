const db = require('./enfermeras-dao');
const helper = require('./helper')

export function getAllTables() {
    return db.getAllTables();
}


export function createReport(reporte) {
    return db.createReport(reporte)
}


export async function modifyReport(dato) {
    let comentarios = [];

    const contenido = await db.bringsComments(dato.id);

    if (contenido.length > 0 && contenido[0].Comentarios) {
        comentarios = JSON.parse(contenido[0].Comentarios);
    }

    const comentariosNuevos = helper(dato, comentarios);

    await db.update(dato.id, JSON.stringify(comentariosNuevos));

    return comentariosNuevos
}