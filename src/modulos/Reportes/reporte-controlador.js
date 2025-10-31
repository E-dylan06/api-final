//repote-controlador.js
const express = require('express');
const router = express.Router();
const service = require('./reporte-servicio');
const respuesta = require('../../respuestas/respuesta');

// POST /reporte
router.post('/', async (req, res) => {
    try {
        const datosFiltro = req.body;
        await service.FilterReport(datosFiltro, res);
    } catch (err) {
        console.error("Error en controlador reporte:", err);
        respuesta.error(req, res, "Error generando reporte", 500);
    }
});

router.post('/enfermera', async (req, res) => {
    try {
        const { id } = req.body;
        await service.reporteEnfermera(id, res);
    } catch (err) {
        console.error("Error en controlador reporte:", err);
        respuesta.error(req, res, "Error generando reporte", 500);
    }
})

module.exports = router;
