const express = require('express');
const router = express.Router();
const service = require('./servicio-servicio');
const respuesta = require('../../respuestas/respuesta');

//GET //Listar servicios
router.get('/', async (req, res) => {
    try {
        const servicios = await service.getServices();
        respuesta.success(req, res, servicios, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

module.exports = router;