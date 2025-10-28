const poolPromise = require('../../infraestructura/conexionDB');
const sql = require('mssql');

//validacion de login

async function login(empleado) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('usuario', sql.NVarChar, empleado.usuario)
            .input('contrasena', sql.NVarChar, empleado.contrasena)
            .query(`
            SELECT IdUsuarioWeb, IdRolesWeb, IdEmpleado
            FROM UsuariosRolesWeb
            WHERE UsuarioWeb = @usuario
            AND ContrasenaUsuario = @contrasena COLLATE Latin1_General_CS_AS
            AND Estado = 1
            `)
        if (result.recordset.length === 0) {
            const err = new Error("Empleado erróneo");
            err.codigo = "EMPLEADO_ERRONEO";
            err.status = 401;
            throw err;
        }
        return result.recordset[0];
    } catch (error) {
        throw error
    }
};

module.exports = {
    login
}