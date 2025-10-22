const db = require('./autentificacion-dao');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const SECRET_KEY = config.app.jwt_secret;

async function login(empleado) {
    try {
        const result = await db.login(empleado);
        if (!result) {
            const err = new Error(`Usuario de empleado ${empleado} no encontrado`);
            err.codigo = "EMPLEADO_NO_ENCONTRADO";
            throw err;
        }

        const IdUsuarioWeb = result.IdUsuarioWeb;
        const rol = result.IdRolesWeb;
        const token = jwt.sign(
            { IdUsuarioWeb, rol },        // payload
            SECRET_KEY,            // clave secreta
            { expiresIn: "12h" }    // duración
        );

        return {
            IdUsuarioWeb: result.IdUsuarioWeb,
            rol : result.IdRolesWeb,
            token
        };
    } catch (error) {
        throw error;
    }
}
module.exports = {
    login
}