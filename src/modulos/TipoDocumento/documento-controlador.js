const express = require('express');
const router = express.Router();
const service = require('./documento-servicio');
const respuesta = require('../../respuestas/respuesta');

//GET /documentos

router.get('/', async (req, res) => {
    try {
        const documentos = await service.getDocumentos();
        respuesta.success(req, res, documentos, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

module.exports = router;
