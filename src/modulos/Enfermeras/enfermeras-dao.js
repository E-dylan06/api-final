const poolPromise = require('../../infraestructura/conexionDB');
const sql = require('mssql');

async function getAllTables() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                    SELECT 
                    IdReporteEnfermera,
                    Codigo,
                    Turno,
                    FechaHora                    
                    FROM ReporteEnfermera
                `)
        return { listaReportes: result.recordset, count: result.recordset.length };
    } catch (error) {
        console.error("hubo un error en el segmenteo de getALL de enfermeras", error);
        throw error;
    }
}

async function createReport(reporte) {
    try {
        const enfermerasJSON = JSON.stringify(reporte.enfermerasTurno);
        const tecnicosJSON = JSON.stringify(reporte.tecnicosTurno);

        const pool = await poolPromise;
        const result = await pool.request()
            .input('IdUsuarioWeb', sql.Int, reporte.idWeb)
            .input('IdEmpleado', sql.Int, reporte.idEmpleado)
            .input('Turno', sql.Char(1), reporte.turno)
            .input('EnfermerasTurno', sql.VarChar(sql.MAX), enfermerasJSON)
            .input('TecnicosTurno', sql.VarChar(sql.MAX), tecnicosJSON)
            .input('Reporte', sql.NVarChar(sql.MAX), reporte.informe)
            .input('Observacion', sql.NVarChar(sql.MAX), reporte.observacion)
            .query(`
                INSERT INTO ReporteEnfermera (
                    IdUsuarioWeb,
                    IdEmpleado,
                    Turno,
                    EnfermerasTurno,
                    TecnicosTurno,
                    Reporte,
                    Observacion
                )
                VALUES (
                    @IdUsuarioWeb,
                    @IdEmpleado,
                    @Turno,
                    @EnfermerasTurno,
                    @TecnicosTurno,
                    @Reporte,
                    @Observacion
                )
            `);
        return {
            success: true
        };
    } catch (error) {
        console.error("Hubo un error en el segmento create de enfermeras:", error);
        throw error;
    }
}

async function update(id, comentariosJSON) {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('Id', sql.Int, id)
            .input('Comentario', sql.NVarChar(sql.MAX), comentariosJSON)
            .query(`
            UPDATE ReporteEnfermera
            SET Comentarios = @Comentario
            WHERE IdReporteEnfermera = @Id
            `)
        console.log("✅ Comentarios actualizados correctamente");
    } catch (error) {
        console.error("hubo un error en el segmenteo de update de enfermeras", error);
        throw error;
    }
}


async function bringsComments(id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query(`
            SELECT Comentarios 
            FROM
            ReporteEnfermera
            WHERE IdReporteEnfermera = @Id;
            `);
        return result.recordset;
    } catch (error) {
        console.error("hubo un error en el segmenteo de bringsComments de enfermeras", error);
        throw error;
    }
}


async function searchByCode(codigo) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Codigo', sql.VarChar(40), codigo)
            .query(`
                SELECT 
                IdReporteEnfermera,
                Codigo,
                FechaHora,
                Turno
                FROM ReporteEnfermera
                WHERE Codigo = @Codigo
            `)
        return { reporte: result.recordset[0] };
    } catch (error) {

        console.error("hubo un error en el segmenteo de searchByCode de enfermeras", error);
        throw error;
    }
}



async function searchById(id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query(`
                    SELECT
                    r.IdReporteEnfermera,
                    ISNULL(e.ApellidoPaterno, '') + ' ' + 
                    ISNULL(e.ApellidoMaterno, '') + ' ' + 
                    ISNULL(e.Nombres, '') AS NombreCompleto,    
                    e.DNI AS DniEmpleado, 
                    r.Turno,
                    r.Codigo,
                    r.FechaHora,
                    r.EnfermerasTurno,
                    r.TecnicosTurno,
                    r.Reporte,
                    r.Observacion,
                    r.Comentarios
                    FROM ReporteEnfermera r 
                    INNER JOIN Empleados AS e ON e.IdEmpleado = r. IdEmpleado
                    WHERE IdReporteEnfermera = @Id
                `);
        return result.recordset[0];
    } catch (error) {
        console.error("hubo un error en el segmenteo de searchById de enfermeras", error);
        throw error;
    }
}

async function searchEnfermeras(dnis = []) {
    if (!dnis.length || dnis.length === 0) return [];
    try {
        const pool = await poolPromise
        const request = pool.request();

        const param = dnis.map((dni, index) => {
            const paramName = `dni${index}`;
            request.input(paramName, sql.VarChar(20), dni);
            return `@${paramName}`
        });
        const query = `
                SELECT
                    ISNULL(ApellidoPaterno, '') + ' ' +
                    ISNULL(ApellidoMaterno, '') + ' ' +
                    ISNULL(Nombres, '') AS NombreCompleto,
                    DNI
                FROM Empleados
                WHERE DNI IN (${param.join(',')})
                `;
        const result = await request.query(query);

        return result.recordset
    } catch (error) {
        console.error("hubo un error en el segmenteo de searchById de enfermeras", error);
        throw error;
    }
}

async function searchTecnicos(dnis = []) {
    if (dnis.length === 0) return [];
    try {
        const pool = await poolPromise
        const request = pool.request();

        const param = dnis.map((dni, index) => {
            const paramName = `dni${index}`;
            request.input(paramName, sql.VarChar(20), dni);
            return `@${paramName}`
        });
        const query = `
                SELECT
                    DNI,
                    ISNULL(ApellidoPaterno,'') + ' ' +
                    ISNULL(ApellidoMaterno,'') + ' ' +
                    ISNULL(Nombres,'') AS NombreCompleto
                FROM Empleados
                WHERE DNI IN (${param.join(',')})
            `;
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error("Error en searchTecnicos", error);
        throw error;
    }
}

/*
CREATE TABLE ReporteEnfermera (
    IdReporteEnfermera INT IDENTITY(1,1),
    IdUsuarioWeb INT NOT NULL, -- FK
    IdEmpleado INT NOT NULL, -- FK
    Turno CHAR(1) NOT NULL, 
    Codigo varchar(40) NOT NULL,
    FechaHora DATETIME2 DEFAULT SYSDATETIME(),
    EnfermerasTurno VARCHAR(MAX) NOT NULL,
    TecnicosTurno VARCHAR(MAX) NOT NULL,
    Reporte NVARCHAR(MAX),
    Observacion NVARCHAR(MAX),
    Comentarios NVARCHAR(MAX),

    CONSTRAINT PK_ReporteEnfermera PRIMARY KEY (IdReporteEnfermera),

    CONSTRAINT FK_ReporteEnfermera_IdUsuarioWeb 
        FOREIGN KEY (IdUsuarioWeb) REFERENCES UsuarioRolesWeb(IdUsuarioWeb),

    CONSTRAINT FK_ReporteEnfermera_IdEmpleado 
        FOREIGN KEY (IdEmpleado) REFERENCES Empleados(IdEmpleado)
);

métodos relacionados a esta tabla para plasmarlo en el front y back

método de buscar empleado mediante dni, y que tenga su rol propio en la tabla ROlweb

select  idEmpleado FROM Empleados where nroDocumento = ?

insert into ReporteEnfermera(IdUsuarioWEb,IdEmpleado,Observación,Reporte) VALUES ()
 */

module.exports = {
    bringsComments,
    createReport,
    getAllTables,
    update,
    searchByCode,
    searchById,
    searchEnfermeras,
    searchTecnicos
}