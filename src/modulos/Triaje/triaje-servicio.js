const db = require('./triaje-dao');
const pacienteDao = require('../Pacientes/paciente-dao');


function createTriaje(triaje) {
    return db.createTriaje(triaje);
}

async function searchTriajeForId(dni) {
    try {
        const idPaciente = await pacienteDao.busquedaIdPaciente(dni);

        if (idPaciente === null) {
            const err = new Error(`Paciente con DNI ${dni} no encontrado`);
            err.codigo = "PACIENTE_NO_ENCONTRADO";
            err.origen = "pacienteDao.busquedaIdPaciente";
            throw err;
        }

        return await db.searchTriajeForId(idPaciente);
    } catch (error) {
        // Le paso el error hacia arriba para que el controlador lo maneje
        throw error;
    }
}

function createTriajeNN(triaje){
    return db.createTriajeNN(triaje);
}

function filterTriaje(filtros){
    return db.filterTriaje(filtros);
}

function TriajeByViewTable(id){
    return db.TriajeByViewTable(id);
}

function TriajePriority(prioridad){
    return db.TriajePriority(prioridad);
}

function statusTriaje(IdTriaje){
    return db.statusTriaje(IdTriaje);
}

function EditTriaje(Triaje){
    return db.EditTriaje(Triaje);
}

function statusTriajeAdmision(datoTriaje){
    return db.statusTriajeAdmision(datoTriaje);
}

module.exports = {
    createTriaje,
    searchTriajeForId,
    createTriajeNN,
    filterTriaje,
    TriajeByViewTable,
    TriajePriority,
    statusTriaje,
    EditTriaje,
    statusTriajeAdmision
}
