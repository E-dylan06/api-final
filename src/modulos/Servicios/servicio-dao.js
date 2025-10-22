const poolPromise = require('../../infraestructura/conexionDB');
const sql = require("mssql");

async function getServices() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
            SELECT 
            IdServicio,
            Nombre
            FROM Servicios  
            WHERE IdServicio IN (103,105,69,104,70,86,106,417)
            `)
        return result.recordset;
    } catch (err) {
        throw err
    }
};
async function getNameService(idServicio) {
    if (!idServicio) return null;

    const pool = await poolPromise;
    const result = await pool.request()
        .input("IdServicio", sql.Int, idServicio)
        .query("SELECT Nombre FROM Servicios WHERE IdServicio = @IdServicio");

    return result.recordset.length > 0 ? result.recordset[0].Nombre : null;
}

module.exports = {
    getServices,
    getNameService
};