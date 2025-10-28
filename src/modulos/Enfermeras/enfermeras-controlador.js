const express = require('express');
const router = express.Router();
const service = require('./enfermeras-servicio');
const respuesta = require('../../respuestas/respuesta')


//get 
router.get('/', async (req, res) => {
    try {
        const respon = await service.getAllTables();
        respuesta.success(req, res, respon, 200);
    } catch (err) {
        console.error("error en el controller de enfermeras", err);
        respuesta.error(req, res, err, 500)
    }
});

router.get('/buscar', async (req, res) => {
    try {
        const { codigo } = req.query;
        if (!codigo) {
            return respuesta.error(req, res, { message: 'Falta el parámetro codigo' }, 400);
        }
        const respon = await service.searchByCode(codigo);
        respuesta.success(req, res, respon, 200);
    } catch (err) {
        console.error("error en el controller de enfermeras", err);
        respuesta.error(req, res, err, 500)
    }
})


//post crear
router.post('/crear', async (req, res) => {
    try {
        const reporte = req.body;
        console.log(reporte);
        const respon = await service.createReport(reporte);
        console.log(respon);
        /*if (!respon.success) {
            err = "codigo invalido";
            return respuesta.error(req, res, err, 401);
        }*/
        respuesta.success(req, res, respon, 200);
    } catch (err) {
        console.error("error en el controller de enfermeras", err);
        respuesta.error(req, res, err, 500)
    }
});

//post update 

router.put('/modificar', async (req, res) => {
    try {
        const comentario = req.body;
        const respon = await service.modifyReport(comentario);
        respuesta.success(req, res, respon, 200);
    } catch (error) {
        console.error("error en el controller de enfermeras", error);
        respuesta.error(req, res, error, 500)
    }
});

router.get('/reporteEspecifico', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return respuesta.error(req, res, "Debe proporcionar un ID válido", 400);
        }
        const respon = await service.searchById(id);
        respuesta.success(req, res, respon, 200)
    } catch (error) {
        console.error("error en el controller de enfermeras", error);
        respuesta.error(req, res, error, 500)
    }
});
module.exports = router;