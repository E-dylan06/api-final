//repote-da
const sql = require("mssql");
const poolPromise = require('../../infraestructura/conexionDB');

function nullable(value) {
    return value === undefined || value === null || value === "" ? null : value;
}

async function FilterReport(filtros) {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("IdServicio", sql.Int, nullable(filtros.IdServicio))
            .input("FechaInicio", sql.DateTime, filtros.FechaInicio || null)
            .input("FechaFin", sql.DateTime, filtros.FechaFin || null)
            .input("IdTipoEdad", sql.Int, nullable(filtros.IdTipoEdad))
            .input("TipoPaciente", sql.VarChar, nullable(filtros.TipoPaciente))
            .input("Prioridad",sql.Int,nullable(filtros.Prioridad))
            .query(`
                SELECT 
                    t.IdTriaje,
                    t.FechaHora,
                    LTRIM(RTRIM(COALESCE(p.PrimerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.PrimerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, 'NN')
                        + ' ' + COALESCE(p.SegundoNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.SegundoNombre COLLATE SQL_Latin1_General_CP1_CI_AS, '')
                        + ' ' + COALESCE(p.TercerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.TercerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, '')
                        + ' ' + COALESCE(p.ApellidoPaterno COLLATE SQL_Latin1_General_CP1_CI_AS, t.ApellidoPaterno COLLATE SQL_Latin1_General_CP1_CI_AS, '')
                        + ' ' + COALESCE(p.ApellidoMaterno COLLATE SQL_Latin1_General_CP1_CI_AS, t.ApellidoMaterno COLLATE SQL_Latin1_General_CP1_CI_AS, '')
                    )) AS NombreCompleto,
                    COALESCE(p.NroDocumento COLLATE SQL_Latin1_General_CP1_CI_AS, 
                            t.NroDocumento COLLATE SQL_Latin1_General_CP1_CI_AS, 
                            'NN') AS NroDocumento,
                    COALESCE(CONVERT(VARCHAR(20), p.FechaNacimiento, 120), 
                            CONVERT(VARCHAR(20), t.FechaNacimiento, 120), 
                            'NN') AS FechaNaci,
                    t.edad,
                    t.IdServicio,
                    s.Nombre AS NombreServicio,
                    t.Prioridad,
                    t.Codigo,
                    e.Descripcion AS TipoEdad
                FROM TriajeEmergencia t
                LEFT JOIN Pacientes p ON t.IdPaciente = p.IdPaciente
                INNER JOIN TiposEdad e ON t.IdTipoEdad = e.IdTipoEdad
                INNER JOIN Servicios s ON t.IdServicio = s.IdServicio
                WHERE t.Estado = 1
                AND (@IdServicio IS NULL OR t.IdServicio = @IdServicio)
                AND (@FechaInicio IS NULL OR t.FechaHora >= @FechaInicio)
                AND (@FechaFin IS NULL OR t.FechaHora < DATEADD(DAY, 1, @FechaFin))
                AND (@IdTipoEdad IS NULL OR t.IdTipoEdad = @IdTipoEdad)
                AND(@Prioridad IS  NULL OR t.Prioridad = @Prioridad)
                AND (
                    @TipoPaciente IS NULL
                    OR (@TipoPaciente = 'REG' AND t.IdPaciente IS NOT NULL)
                    OR (@TipoPaciente = 'NN'  AND t.IdPaciente IS NULL AND t.Codigo IS NOT NULL)
                )
                ORDER BY t.FechaHora DESC
            `);
        return result.recordset;
    } catch (err) {
        throw err;
    }
}

///

// REPORTE DE ENFERMERA INDIVIDUALMENTE 

////



async function reporte(params) {
    
}



module.exports = {
    FilterReport
};