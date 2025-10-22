const express = require('express');
const router = express.Router();
const service = require('./triaje-servicio');
const respuesta = require('../../respuestas/respuesta');


//GET //traer triajes
router.get('/buscar', async (req, res) => {
    try {
        const dni = String(req.query.dni).trim();
        const triajes = await service.searchTriajeForId(dni);
        respuesta.success(req, res, triajes, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

//GET //filtrar datos del triaje
router.post('/filtro', async (req, res) => {
    try {
        const datosFiltro = req.body;
        const rows = await service.filterTriaje(datosFiltro);
        let respuestaFinal;
        if (rows && rows.triajes) {
            const normalizados = rows.triajes.map(r => normalizarRegistro(r));
            respuestaFinal = {
                triajes: normalizados,
                total: rows.total || normalizados.length
            };
        } else {
            respuestaFinal = {
                triajes: [],
                total: 0
            };
        }
        respuesta.success(req, res, respuestaFinal, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

//POST //ingresar nuevo triaje
router.post('/crearTriaje', async (req, res) => {
    try {
        const triaje = req.body;
        const result = await service.createTriaje(triaje);
        respuesta.success(req, res, result, 201);
    } catch (error) {
        console.error("Error al crear Triaje:", err);
        respuesta.error(req, res, err.message || err, 500);
    }
});

//POST //ingresa un triaje NN o un paciente no registrado
router.post('/no-registrados', async (req, res) => {
    try {
        const triaje = req.body;
        const result = await service.createTriajeNN(triaje);
        respuesta.success(req, res, result, 201);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
})

//metodo auxiliar 
function normalizarRegistro(obj) {
    const result = {};
    for (let key in obj) {
        result[key] = obj[key] === null ? "NN" : obj[key];
    }
    return result;
}

//GET // BUSCAMOS UN TRIAJE ESPECIFICO CON DEPENDENCIA DE LA TABLA VIEWTABLE
router.get('/buscarTriaje', async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const datos = await service.TriajeByViewTable(id);
        respuesta.success(req, res, datos, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});
//-----------
//GET //STATUS DE TRIAJES(cambiar estado a eliminado)
router.put('/eliminarTriaje', async (req, res) => {
    try {
        const id = parseInt(req.body.id);
        if (!id) {
            return respuesta.error(req, res, "ID inválido", 400);
        }
        const datos = await service.statusTriaje(id);
        respuesta.success(req, res, datos, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

router.post('/actualizarPrioridad', async (req, res) => {
    try {
        const prioridad = req.body;
        const datos = await service.TriajePriority(prioridad);
        respuesta.success(req, res, datos, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

router.patch('/editar', async (req, res) => {
    try {
        const triaje = req.body;
        console.log('📝 Datos recibidos en EditTriaje:', triaje);
        console.log('📝 idEmpleado recibido en EditTriaje:', triaje.IdEmpleadoRolWeb);
        const datos = await service.EditTriaje(triaje);
        respuesta.success(req, res, datos, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

router.put('/actualizarEstadoAdmision', async (req, res) => {
    try {
        const datoTriaje = req.body;
        console.log("datos traidos",datoTriaje);
        const dato = await service.statusTriajeAdmision(datoTriaje);
        respuesta.success(req, res, dato, 200);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
});

module.exports = router;