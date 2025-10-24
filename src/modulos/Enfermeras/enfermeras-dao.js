const poolPromise = require('../../infraestructura/conexionDB');
const sql = require('mssql');

export async function getAllTables(params) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input()
            .query(`
                    SELECT 
                    IdReporteEnfermera,
                    Codigo,
                    FechaHora
                    Turno
                    FROM ReporteEnfermera
                `)
        return result.recordset;
    } catch (error) {
        console.error("hubo un error en el segmenteo de getALL de enfermeras", error);
        throw error;
    }
}

export async function createReport(reporte) {
    try {
        const pool = await sql.poolPromise;
        const result = await pool.request()
            .input('IdUsuarioWeb', sql.Int, reporte.idWeb)
            .input('IdEmpleado', sql.Int, reporte.idEmpleado)
            .input('Turno', sql.Char(1), reporte.turno)
            .input('EnfermerasTurno', sql.VarChar(sql.MAX), reporte.enfermerasTurno)
            .input('TecnicosTurno', sql.VarChar(sql.MAX), reporte.tecnicosTurno)
            .input('Reporte', sql.NVarChar(sql.MAX), reporte.informe)
            .input('Observacion', sql.NVarChar(sql.MAX), reporte.observacion)
            .input('Comentarios', sql.NVarChar(sql.MAX), reporte.comentarios)
            .query(`
                INSERT INTO ReporteEnfermera (
                    IdUsuarioWeb,
                    IdEmpleado,
                    Turno,
                    EnfermerasTurno,
                    TecnicosTurno,
                    Reporte,
                    Observacion,
                    Comentarios
                )
                VALUES (
                    @IdUsuarioWeb,
                    @IdEmpleado,
                    @Turno,
                    @EnfermerasTurno,
                    @TecnicosTurno,
                    @Reporte,
                    @Observacion,
                    @Comentarios
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

export async function update(id, comentariosJSON) {
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


export async function bringsComments(id) {
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

