const express = require('express');
const router = express.Router();
const service = require('./TipoEdad-servicio');
const respuesta = require('../../respuestas/respuesta');

router.get('/', async (req, res) => {
    try {
        const TipoEdad = await service.getTipoEdad();
        respuesta.success(req, res, TipoEdad, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
})

module.exports = router;



