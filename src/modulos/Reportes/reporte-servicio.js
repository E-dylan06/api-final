//repote-servicio.js
const db = require('./reporte-dao');
const pdf = require('./reporte-pdf');
const method = require('../Servicios/servicio-servicio');
const dbEnf = require('../Enfermeras/enfermeras-servicio');
const pdfEnf = require('./reporte-enfermera-pdf');

async function FilterReport(filtroReportes, res) {
    // 1. Obtener datos desde el DAO
    const rows = await db.FilterReport(filtroReportes);

    if (filtroReportes.IdServicio) {
        filtroReportes.NombreServicio = await method.getNameService(filtroReportes.IdServicio);
    }

    // 2. Normalizar datos (opcional)
    const normalizados = (rows || []).map(r => normalizarRegistro(r));

    // 3. Generar PDF directamente con la respuesta
    return pdf.generarPDF(normalizados, filtroReportes, res);
}

// helper
function normalizarRegistro(obj) {
    const result = {};
    for (let key in obj) {
        result[key] = obj[key] === null ? "N/A" : obj[key];
    }
    return result;
}



async function reporteEnfermera(id, res) {
    try {
        const reporteJSON = await dbEnf.searchById(id);
        if (!reporteJSON) {
            throw new Error('Reporte no encontrado');
        }

        // Enviar el JSON completo al generador de PDF
        return pdfEnf.generarEnfermeraPDF(reporteJSON, res);

    } catch (error) {
        console.error('Error en servicio de reporte:', error);
        throw error;
    }
}
module.exports = { FilterReport, reporteEnfermera };
