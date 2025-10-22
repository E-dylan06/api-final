// app.js
const express = require('express');
const cors = require('cors');
const config = require('./config');
const jwt = require("jsonwebtoken");

const pacienteRouter = require('./modulos/Pacientes/pacientes-controlador');
const documentosRouter = require('./modulos/TipoDocumento/documento-controlador');
const serviciosRouter = require('./modulos/Servicios/servicio-controlador');
const triajeRouter = require('./modulos/Triaje/triaje-controlador');
const loginRouter = require('./modulos/auth/autentificacion-controlador');
const tipoEdadRouter = require('./modulos/TipoEdad/TipoEdad-controlador');
const reporteRouter = require('./modulos/Reportes/reporte-controlador');

const app = express();

// Middlewares
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('port', config.app.port);
// Rutas
app.use('/api/pacientes', pacienteRouter);
app.use('/api/documentos', documentosRouter);
app.use('/api/triaje', triajeRouter);
app.use('/api/servicios', serviciosRouter);
app.use('/api/login', loginRouter);
app.use('/api/TipoEdad',tipoEdadRouter);
app.use('/api/reporte',reporteRouter);



//ruta prueba
app.get('/', (req, res) => {
    res.json({
        message: 'conexion correcta',
        version: '1.0.0.0',
        status: 'corriendo'
    });
});

module.exports = app;
