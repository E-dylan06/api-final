const express = require('express');
const router = express.Router();
const service = require('./enfermeras-servicio');
const respuesta = require('../../respuestas/respuesta')


//
router.get('/', async (req, res) => {
    try {
        const dato = req.query.dato;
        const respuesta = await service.getAllTables();
        respuesta.success(req, res, respuesta, 200);
    } catch (err) {
        console.error("error en el controller de enfermeras", err);
        respuesta.error(req, res, err, 500)
    }
});


//post crear
router.post('/crear', async (req, res) => {
    try {
        const reporte = req.query.reporte;
        const respuesta = await service.createReport(reporte);
        respuesta.success(req, res, respuesta, 200);
    } catch (err) {
        console.err("error en el controller de enfermeras", err);
        respuesta.error(req, res, err, 500)
    }
});

//post update 

router.put('/modificar', async (req, res) => {
    try {
        const comentario = req.body;
        const respuesta = await service.modifyReport(comentario);
        respuesta.success(req, res, respuesta, 200);
    } catch (error) {
        console.error("error en el controller de enfermeras", err);
        respuesta.error(req, res, err, 500)
    }
})