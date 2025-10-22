const poolPromise = require('../../infraestructura/conexionDB');
const sql = require('mssql');



async function getTipoEdad() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
        SELECT IdTipoEdad,Descripcion
        FROM TiposEdad 
        `)
        return result.recordset;
    } catch (err) {
        throw err
    }
};


module.exports = {
    getTipoEdad
};