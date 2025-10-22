const poolPromise = require('../../infraestructura/conexionDB');
const sql = require('mssql');


async function getDocumentos() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
        SELECT IdDocIdentidad, Descripcion 
        FROM TiposDocIdentidad 
        `)
        return result.recordset;
    } catch (err) {
        throw err
    }
};

module.exports = {
    getDocumentos
};