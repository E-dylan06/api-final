const express = require('express');
const router = express.Router();
const service = require('./paciente-servicio');
const respuesta = require('../../respuestas/respuesta');

// GET /pacientes
router.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const pacientes = await service.getAll(pagina);
        respuesta.success(req, res, pacientes, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});


router.get('/buscar', async (req, res) => {
    try {
        const dni = String(req.query.dni);
        const pacientes = await service.search(dni);
        respuesta.success(req, res, pacientes, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

/*router.post('/crearPaciente', async (req, res) => {
    try {
        const paciente = req.body;
        const result = await service.createPaciente(paciente);
        respuesta.success(req, res, result, 201);
    } catch (err) {
        console.error("Error en crearPaciente:", err);
        respuesta.error(req, res, err.message || err, 500);
    }
});*/

module.exports = router;