const poolPromise = require('../../infraestructura/conexionDB');
const sql = require('mssql');

// Obtener pacientes paginados(listado de pacientes)
async function getAll(pagina = 1) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Pagina', pagina)
            .query(`
                SELECT
                    p.IdPaciente,
                    p.ApellidoMaterno,
                    p.ApellidoPaterno,
                    p.PrimerNombre,
                    p.SegundoNombre,
                    p.FechaNacimiento,
                    p.NroDocumento,
                    s.Descripcion AS Sexo
                FROM Pacientes p
                INNER JOIN TiposSexo s ON p.IdTipoSexo = s.IdTipoSexo
                ORDER BY p.IdPaciente
                OFFSET (@Pagina - 1) * 30 ROWS
                FETCH NEXT 30 ROWS ONLY;
            `);
        return result.recordset;
    } catch (err) {
        throw err;
    }
}
//Busqueda de pacientes en especifico
async function search(dni) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Dni', sql.VarChar, dni)
            .query(`
            SELECT
                p.IdPaciente,
                p.ApellidoMaterno,
                p.ApellidoPaterno,
                p.PrimerNombre,
                p.SegundoNombre,
                p.FechaNacimiento,
                p.NroDocumento,
                s.Descripcion
            FROM Pacientes p 
            INNER JOIN TiposSexo s ON p.IdTipoSexo = s.IdTipoSexo
            WHERE NroDocumento= @Dni
            `);
        return result.recordset[0];
    } catch (err) {
        console.error("error en el search (dni):", err)
        throw err;
    }
}

/*async function createPaciente(paciente) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ApellidoMaterno', sql.VarChar, paciente.ApellidoMaterno)
            .input('ApellidoPaterno', sql.VarChar, paciente.ApellidoPaterno)
            .input('PrimerNombre', sql.VarChar, paciente.PrimerNombre)
            .input('SegundoNombre', sql.VarChar, paciente.SegundoNombre)
            .input('FechaNacimiento', sql.Date, paciente.FechaNacimiento)
            .input('NroDocumento', sql.VarChar, paciente.NroDocumento)
            .input('IdTipoSexo', sql.Int, paciente.IdTipoSexo)
            .query(`
                INSERT INTO Pacientes (
                    ApellidoMaterno,
                    ApellidoPaterno,
                    PrimerNombre,
                    SegundoNombre,
                    FechaNacimiento,
                    NroDocumento,
                    IdTipoSexo
                )
                VALUES (
                    @ApellidoMaterno,
                    @ApellidoPaterno,
                    @PrimerNombre,
                    @SegundoNombre,
                    @FechaNacimiento,
                    @NroDocumento,
                    @IdTipoSexo
                );
            `);

        return { success: true, rowsAffected: result.rowsAffected };
    } catch (err) {
        throw err
    }
}*/
async function busquedaIdPaciente(dni) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Dni', sql.VarChar, dni)
            .query(`SELECT IdPaciente FROM Pacientes WHERE NroDocumento = @Dni`);
        if (!result.recordset || result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0].IdPaciente;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getAll,
    search,
    busquedaIdPaciente
    // createPaciente
};
