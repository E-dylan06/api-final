const express = require('express');
const router = express.Router();
const service = require('./autentificacion-servicio');
const respuesta = require('../../respuestas/respuesta');



//POST //login validar empleado

router.post('/', async (req, res) => {
    try {
        const empleado = req.body
        const info = await service.login(empleado);
        respuesta.success(req, res, info, 200);
    } catch (err) {
        const statusCode = err.status || 500;
        const mensaje = err.message || "Error interno del servidor";
        respuesta.error(req, res, mensaje, statusCode);
    }
})

module.exports = router;