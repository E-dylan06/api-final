const poolPromise = require('../../infraestructura/conexionDB');
const sql = require('mssql');

// Crea un nuevo triaje con el usuario
async function createTriaje(triaje) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('IdUsuarioWeb', sql.Int, triaje.idEmpleadoRolWeb)
            .input('IdPaciente', sql.Int, triaje.IdPaciente)
            .input('IdTipoEdad', sql.Int, triaje.IdTipoEdad)
            .input('edad', sql.Int, triaje.edad)
            .input('FrecuenciaCardiaca', sql.Int, triaje.FrecuenciaCardiaca)
            .input('Temperatura', sql.Decimal(4, 1), triaje.Temperatura)
            .input('PaSistolica', sql.Int, nullable(triaje.PaSistolica))
            .input('PaDiastolica', sql.Int, nullable(triaje.PaDiastolica))
            .input('Saturacion', sql.Int, triaje.Saturacion)
            .input('Peso', sql.Decimal(5, 2), triaje.Peso)
            .input('Talla', sql.Decimal(5, 2), triaje.Talla)
            .input('IdServicio', sql.Int, triaje.IdServicio)
            .input('FrecRespiratoria', sql.Int, triaje.FrecRespiratoria)
            // .input('Prioridad', sql.Int, triaje.Prioridad)
            .input('SufreAlergia', sql.VarChar(12), nullable(triaje.SufreAlergia))
            .input('ObsAlergica', sql.VarChar(sql.MAX), nullable(triaje.ObsAlergica))
            .input('Pulso', sql.Int, triaje.Pulso)
            .input('PerAbdominal', sql.Decimal(4, 1), nullable(triaje.PerAbdominal))
            .input('PerCefalico', sql.Decimal(4, 1), nullable(triaje.PerCefalico))
            .query(`
                INSERT INTO TriajeEmergencia
                (IdPaciente, IdTipoEdad, edad, FrecuenciaCardiaca, Temperatura, PaSistolica,
                 PaDiastolica, Saturacion, Peso, Talla, IdServicio,
                 SufreAlergia, ObsAlergica,IdUsuarioWeb,PerCefalico,PerAbdominal,Pulso, FrecRespiratoria)
                VALUES
                (@IdPaciente, @IdTipoEdad, @edad, @FrecuenciaCardiaca, @Temperatura, @PaSistolica,
                 @PaDiastolica, @Saturacion, @Peso, @Talla, @IdServicio,
                 @SufreAlergia, @ObsAlergica, @IdUsuarioWeb,@PerCefalico,@PerAbdominal,@Pulso, @FrecRespiratoria)
            `);
        //quite Prioridad de los query y  value
        return { success: true, rowsAffected: result.rowsAffected };
    } catch (err) {
        throw err;
    }
};

//lista los triajes deacuerdo al paciente
//ROW_NUMBER() OVER (ORDER BY t.FechaHora DESC) + @Skip AS Nro, (codigo para cuando ingrese una pagina cion en la tabla)
async function searchTriajeForId(IdPaciente) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('IdPaciente', sql.Int, IdPaciente)
            .query(`
                    SELECT 
                    
                    ROW_NUMBER() OVER (ORDER BY t.FechaHora DESC) AS Nro,
                        t.IdTriaje,
                        t.FechaHora,
                        LTRIM(RTRIM(
                        COALESCE(p.ApellidoPaterno COLLATE SQL_Latin1_General_CP1_CI_AS, t.ApellidoPaterno COLLATE SQL_Latin1_General_CP1_CI_AS, 'NN')
                        + ' ' + COALESCE(p.ApellidoMaterno COLLATE SQL_Latin1_General_CP1_CI_AS, t.ApellidoMaterno COLLATE SQL_Latin1_General_CP1_CI_AS, '')
                        + ' ' + COALESCE(p.PrimerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.PrimerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, '')
                        + ' ' + COALESCE(p.SegundoNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.SegundoNombre COLLATE SQL_Latin1_General_CP1_CI_AS, '')
                        + ' ' + COALESCE(p.TercerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.TercerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, '')
                    )) AS NombreCompleto,
                        COALESCE(p.NroDocumento COLLATE SQL_Latin1_General_CP1_CI_AS, 
                                t.NroDocumento COLLATE SQL_Latin1_General_CP1_CI_AS, 
                                'NN') AS NroDocumento,
                        COALESCE(CONVERT(VARCHAR(20), p.FechaNacimiento, 120), 
                                CONVERT(VARCHAR(20), t.FechaNacimiento, 120), 
                                'NN') AS FechaNaci,
                        COALESCE(p.IdTipoSexo, t.IdTipoSexo, '') AS TipoSexo,
                        t.Edad,
                        t.Prioridad,
                        t.Temperatura,
                        t.Codigo,
                        t.EstadoAdmision,
                        s.Nombre AS NombreServicio,
                        e.Codigo AS NombreTipoEdad
                    FROM TriajeEmergencia t
                    LEFT JOIN Pacientes p ON t.IdPaciente = p.IdPaciente
                    INNER JOIN Servicios s ON t.IdServicio = s.IdServicio
                    INNER JOIN TiposEdad e ON t.IdTipoEdad = e.IdTipoEdad
                    WHERE t.IdPaciente = @IdPaciente
                    AND  t.Estado = 1
                    ORDER BY t.FechaHora DESC;
            `)
        return result.recordset;
    } catch (err) {
        throw err
    }
};

//crea paceinte NN
async function createTriajeNN(triaje) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('IdUsuarioWeb', sql.Int, nullable(triaje.idEmpleadoRolWeb))
            .input('IdTipoEdad', sql.Int, nullable(triaje.IdTipoEdad))
            .input('edad', sql.Int, nullable(triaje.edad))
            .input('FrecuenciaCardiaca', sql.Int, nullable(triaje.FrecuenciaCardiaca))
            .input('Temperatura', sql.Decimal(4, 1), nullable(triaje.Temperatura))
            .input('PaSistolica', sql.Int, nullable(triaje.PaSistolica))
            .input('PaDiastolica', sql.Int, nullable(triaje.PaDiastolica))
            .input('Saturacion', sql.Int, nullable(triaje.Saturacion))
            .input('Peso', sql.Decimal(5, 2), nullable(triaje.Peso))
            .input('Talla', sql.Decimal(5, 2), nullable(triaje.Talla))
            .input('IdServicio', sql.Int, nullable(triaje.IdServicio))
            .input('SufreAlergia', sql.VarChar(12), nullable(triaje.SufreAlergia))
            .input('ObsAlergica', sql.VarChar(sql.MAX), nullable(triaje.ObsAlergica))
            .input('FrecRespiratoria', sql.Int, nullable(triaje.FrecRespiratoria))
            .input('PrimerNombre', sql.VarChar(20), nullable(triaje.PrimerNombre))
            .input('SegundoNombre', sql.VarChar(20), nullable(triaje.SegundoNombre))
            .input('TercerNombre', sql.VarChar(20), nullable(triaje.TercerNombre))
            .input('ApellidoPaterno', sql.VarChar(20), nullable(triaje.ApellidoPaterno))
            .input('ApellidoMaterno', sql.VarChar(20), nullable(triaje.ApellidoMaterno))
            .input('NroDocumento', sql.VarChar(20), nullable(triaje.NroDocumento))
            .input('IdTipoSexo', sql.Int, nullable(triaje.IdTipoSexo))
            .input('FechaNacimiento', sql.Date, nullable(triaje.FechaNacimiento))
            .input('Pulso', sql.Int, nullable(triaje.Pulso))
            .input('PerAbdominal', sql.Decimal(5, 2), nullable(triaje.PerAbdominal))
            .input('PerCefalico', sql.Decimal(5, 2), nullable(triaje.PerCefalico))
            .query(`
                INSERT INTO TriajeEmergencia
                (IdTipoEdad, edad, FrecuenciaCardiaca, Temperatura, PaSistolica,
                 PaDiastolica, Saturacion, Peso, Talla, IdServicio,
                 SufreAlergia, ObsAlergica, IdUsuarioWeb, PrimerNombre, SegundoNombre, TercerNombre, ApellidoPaterno,
                 ApellidoMaterno, NroDocumento, FechaNacimiento, Pulso, PerAbdominal, PerCefalico,FrecRespiratoria,IdTipoSexo)
                OUTPUT INSERTED.IdTriaje
                VALUES
                (@IdTipoEdad, @edad, @FrecuenciaCardiaca, @Temperatura, @PaSistolica,
                 @PaDiastolica, @Saturacion, @Peso, @Talla, @IdServicio, @SufreAlergia, @ObsAlergica, @IdUsuarioWeb,  @PrimerNombre, @SegundoNombre, @TercerNombre, @ApellidoPaterno,
                 @ApellidoMaterno, @NroDocumento, @FechaNacimiento, @Pulso, @PerAbdominal, @PerCefalico,@FrecRespiratoria,@IdTipoSexo)
                 `);
        const id = result.recordset[0].IdTriaje;
        return await GenerarCodigo(id);
    } catch (err) {
        throw err;
    }
}
//genera el codigo para NN
async function GenerarCodigo(id) {
    try {
        const codigo = "NN" + String(id).padStart(10, "0");
        const pool = await poolPromise;
        await pool.request()
            .input("idTriaje", sql.Int, id)
            .input("codigo", sql.VarChar(20), codigo)
            .query(`
                UPDATE TriajeEmergencia 
                SET Codigo = @codigo
                WHERE IdTriaje = @idTriaje
                `);
        return { codigo };
    } catch (err) {
        throw err
    }
}
//helper para datos null
function nullable(value) {
    return value === undefined || value === "" ? null : value;
}

//filtros para traer triajes especificos
async function filterTriaje(filtros) {
    try {
        const skip = ((filtros.page || 1) - 1) * (filtros.pageSize || 50);
        const pool = await poolPromise;
        const result = await pool.request()
            .input("IdServicio", sql.Int, nullable(filtros.IdServicio))
            .input("FechaInicio", sql.DateTime, nullable(filtros.FechaInicio || null))
            .input("FechaFin", sql.Date, nullable(filtros.FechaFin || null))
            .input("IdTipoEdad", sql.Int, nullable(filtros.IdTipoEdad))
            .input("Prioridad", sql.Int, nullable(filtros.Prioridad))
            .input("Skip", sql.Int, skip)
            .input("Take", sql.Int, filtros.pageSize || 10)
            .input("TipoPaciente", sql.VarChar(10), nullable(filtros.TipoPaciente))
            .query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY t.FechaHora DESC) AS Nro,
                t.IdTriaje,
                t.FechaHora,
LTRIM(RTRIM(
    COALESCE(p.ApellidoPaterno COLLATE SQL_Latin1_General_CP1_CI_AS, t.ApellidoPaterno COLLATE SQL_Latin1_General_CP1_CI_AS, 'NN')
    + ' ' + COALESCE(p.ApellidoMaterno COLLATE SQL_Latin1_General_CP1_CI_AS, t.ApellidoMaterno COLLATE SQL_Latin1_General_CP1_CI_AS, '')
    + ' ' + COALESCE(p.PrimerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.PrimerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, '')
    + ' ' + COALESCE(p.SegundoNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.SegundoNombre COLLATE SQL_Latin1_General_CP1_CI_AS, '')
    + ' ' + COALESCE(p.TercerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, t.TercerNombre COLLATE SQL_Latin1_General_CP1_CI_AS, '')
)) AS NombreCompleto,

                COALESCE(p.NroDocumento COLLATE SQL_Latin1_General_CP1_CI_AS, 
                        t.NroDocumento COLLATE SQL_Latin1_General_CP1_CI_AS, 
                        'NN') AS NroDocumento,
                COALESCE(CONVERT(VARCHAR(20), p.FechaNacimiento, 120), 
                        CONVERT(VARCHAR(20), t.FechaNacimiento, 120), 
                        'NN') AS FechaNaci,
                COALESCE(p.IdTipoSexo, t.IdTipoSexo, '') AS TipoSexo,
                t.edad,
                t.Prioridad,
                t.Codigo,
                t.EstadoAdmision,
                t.Temperatura,
                s.Nombre AS NombreServicio,
                e.Codigo AS NombreTipoEdad
            FROM TriajeEmergencia t
            LEFT JOIN Pacientes p ON t.IdPaciente = p.IdPaciente
            INNER JOIN Servicios s ON t.IdServicio = s.IdServicio
            INNER JOIN TiposEdad e ON t.IdTipoEdad = e.IdTipoEdad
            WHERE (@IdServicio IS NULL OR t.IdServicio = @IdServicio)
            AND (@FechaInicio IS NULL OR t.FechaHora >= @FechaInicio)
            AND (@FechaFin IS NULL OR t.FechaHora < DATEADD(DAY, 1, @FechaFin))
            AND (@IdTipoEdad IS NULL OR t.IdTipoEdad = @IdTipoEdad)
            AND (
                    @TipoPaciente IS NULL
                    OR (@TipoPaciente = 'REG' AND t.IdPaciente IS NOT NULL)
                    OR (@TipoPaciente = 'NN'  AND t.IdPaciente IS NULL AND t.Codigo IS NOT NULL)
                )
            AND(@Prioridad IS  NULL OR t.Prioridad = @Prioridad)
            AND t.Estado = 1
            ORDER BY t.FechaHora DESC
            OFFSET CAST(@Skip AS INT) ROWS 
            FETCH NEXT CAST(@Take AS INT) ROWS ONLY;

            SELECT COUNT(*) AS TotalRegistros
            FROM TriajeEmergencia t
            INNER JOIN Servicios s ON t.IdServicio = s.IdServicio
            WHERE (@IdServicio IS NULL OR t.IdServicio = @IdServicio)
            AND (@FechaInicio IS NULL OR t.FechaHora >= @FechaInicio)
            AND (@FechaFin IS NULL OR t.FechaHora < DATEADD(DAY, 1, @FechaFin))
            AND (@IdTipoEdad IS NULL OR t.IdTipoEdad = @IdTipoEdad)
            AND (
                    @TipoPaciente IS NULL
                    OR (@TipoPaciente = 'REG' AND t.IdPaciente IS NOT NULL)
                    OR (@TipoPaciente = 'NN'  AND t.IdPaciente IS NULL AND t.Codigo IS NOT NULL)
                )
            AND(@Prioridad IS  NULL OR t.Prioridad = @Prioridad)
            AND t.Estado = 1;
            `);
        return {
            triajes: result.recordsets[0],
            total: result.recordsets[1][0].TotalRegistros
        };
    } catch (err) {
        console.error("Error en filterTriaje:", err);
        throw err;
    }
};

//Trae Los datos especificos del triaje (convinados con pacientes y NN)
async function TriajeByViewTable(id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("IdTriaje", sql.Int, id)
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
            t.FrecuenciaCardiaca,
            t.Temperatura,
            t.PaSistolica,
            t.PaDiastolica,
            t.Saturacion,
            t.FrecRespiratoria,
            t.Peso,
            t.Talla,
            t.IdServicio,
            t.IdTipoEdad,
            s.Nombre AS NombreServicio,
            t.Prioridad,
            t.SufreAlergia,
            t.ObsAlergica,
            t.Pulso,
            t.PerAbdominal,
            t.PerCefalico,
            t.Codigo,
            e.Descripcion
            FROM TriajeEmergencia t
            LEFT JOIN Pacientes p ON t.IdPaciente = p.IdPaciente
            INNER JOIN TiposEdad e ON t.IdTipoEdad = e.IdTipoEdad
            INNER JOIN Servicios s ON t.IdServicio = s.IdServicio
            WHERE t.IdTriaje = @IdTriaje
            AND t.Estado = 1;
            `)
        return result.recordset[0];
    } catch (err) {
        throw err
    }
};

//metodo para eliminar triaje //actualizar estado
async function statusTriaje(idTriaje) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("IdTriaje", sql.Int, idTriaje)
            .query(`
            UPDATE TriajeEmergencia
            SET Estado = 0
            WHERE IdTriaje = @IdTriaje
            `);
        return { rowsAffected: result.rowsAffected[0] };
    } catch (err) {
        throw err
    }
}

async function statusTriajeAdmision(datoTriaje) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("IdTriaje", sql.Int, datoTriaje.idTriaje)
            .input("IdUsuarioAdmision", sql.Int, datoTriaje.IdUsuarioWeb)
            .query(`
                UPDATE TriajeEmergencia
                SET EstadoAdmision = 1,
                IdUsuarioAdmision = @IdUsuarioAdmision
                WHERE IdTriaje = @IdTriaje                
                `)
        return
    } catch (err) {
        throw err
    }
}

//metodo par actualizar prioridad
async function TriajePriority(prioridad) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("IdTriaje", sql.Int, prioridad.IdTriaje)
            .input("Nivel", sql.Int, prioridad.nivel)
            .input("IdMedico", sql.Int, prioridad.IdMedico)
            .query(`
             UPDATE TriajeEmergencia
             SET Prioridad = @Nivel,
             idUsuarioMedico = @IdMedico
             WHERE IdTriaje = @IdTriaje
             AND Estado = 1
            `);
        return { message: "Cambio exitoso" };
    } catch (err) {
        throw err
    }
}

async function EditTriaje(triaje, idEmpleado) {
    try {
        // === 1. Conexión al pool de SQL Server ===
        const pool = await poolPromise;
        // === 2. Validar IdTriaje obligatorio ===
        if (!triaje.IdTriaje) {
            throw new Error("IdTriaje es obligatorio");
        }
        // === 3. Obtener registro ANTES de actualizar ===
        const beforeQuery = await pool.request()
            .input("IdTriaje", sql.Int, triaje.IdTriaje)
            .query(`
        SELECT 
                FrecuenciaCardiaca,
                Temperatura,
                PaSistolica,
                PaDiastolica,
                Saturacion,
                Peso,
                Talla,
                IdServicio,
                IdServicio,
                Prioridad,
                SufreAlergia,
                ObsAlergica,
                Pulso,
                PerAbdominal,
                PerCefalico,
                FrecRespiratoria
        FROM TriajeEmergencia 
        WHERE IdTriaje = @IdTriaje AND Estado = 1
      `);
        if (beforeQuery.recordset.length === 0) {
            throw new Error("Triaje no encontrado o inactivo");
        }
        const antes = beforeQuery.recordset[0];
        // === 4. Definir campos editables y sus tipos SQL ===
        const camposSQL = {
            IdTipoEdad: sql.Int,
            edad: sql.Int,
            FrecuenciaCardiaca: sql.Int,
            Temperatura: sql.Decimal(5, 2),
            PaSistolica: sql.Int,
            PaDiastolica: sql.Int,
            FrecRespiratoria: sql.Int,
            Saturacion: sql.Int,
            Peso: sql.Decimal(5, 2),
            Talla: sql.Decimal(5, 2),
            IdServicio: sql.Int,
            Prioridad: sql.Int,
            SufreAlergia: sql.VarChar(12),
            ObsAlergica: sql.VarChar(sql.MAX),
            Pulso: sql.Int,
            PerAbdominal: sql.Decimal(5, 2),
            PerCefalico: sql.Decimal(5, 2)
        };
        // === 5. Construir dinámicamente la consulta UPDATE ===
        const request = pool.request();
        const setClauses = [];
        for (const [campo, tipo] of Object.entries(camposSQL)) {
            if (triaje[campo] !== undefined && triaje[campo] !== null) {
                request.input(campo, tipo, triaje[campo]);
                setClauses.push(`${campo} = @${campo}`);
            }
        }
        if (setClauses.length === 0) {
            throw new Error("No hay campos para actualizar");
        }
        // Añadir IdTriaje al request
        request.input("IdTriaje", sql.Int, triaje.IdTriaje);
        // === 6. Ejecutar el UPDATE ===
        const sqlQuery = `
      UPDATE TriajeEmergencia
      SET ${setClauses.join(", ")}
      WHERE IdTriaje = @IdTriaje AND Estado = 1
    `;
        const result = await request.query(sqlQuery);
        if (result.rowsAffected[0] === 0) {
            throw new Error("No se actualizó ningún registro");
        }
        // === 7. Obtener registro DESPUÉS de actualizar ===
        const afterQuery = await pool.request()
            .input("IdTriaje", sql.Int, triaje.IdTriaje)
            .query(`
        SELECT
        FrecuenciaCardiaca,
        Temperatura,
        PaSistolica,
        PaDiastolica,
        Saturacion,
        Peso,
        Talla,
        IdServicio,
        IdServicio,
        Prioridad,
        SufreAlergia,
        ObsAlergica,
        Pulso,
        PerAbdominal,
        PerCefalico,
        FrecRespiratoria
        FROM TriajeEmergencia 
        WHERE IdTriaje = @IdTriaje AND Estado = 1
      `);
        const despues = afterQuery.recordset[0];
        // === 8. Guardar historial de cambios ===
        await guardarHistorialTriaje(pool, triaje.IdTriaje, triaje.IdUsuarioWeb, antes, despues);
        // === 9. Retornar resultado ===
        return { success: true, updated: result.rowsAffected[0] };
    } catch (err) {
        // Lanza el error para que lo maneje el controlador superior
        throw err;
    }
}

//funcion para guardar en el histoprial
async function guardarHistorialTriaje(poolOrTransaction, idTriaje, IdUsuarioWeb, antes, despues) {
    const request = new sql.Request(poolOrTransaction); // soporta pool o transaction
    await request
        .input("IdTriaje", sql.Int, idTriaje)
        .input("IdUsuarioWeb", sql.Int, IdUsuarioWeb)
        .input("Antes", sql.NVarChar(sql.MAX), JSON.stringify(antes))
        .input("Despues", sql.NVarChar(sql.MAX), JSON.stringify(despues))
        .input("FechaHora", sql.DateTime, new Date())
        .query(`
            INSERT INTO HistorialTriaje (IdTriaje, IdUsuarioWeb, FechaHora, Antes, Despues)
            VALUES (@IdTriaje, @IdUsuarioWeb, @FechaHora, @Antes, @Despues)
        `);
}

module.exports = {
    createTriaje,
    searchTriajeForId,
    createTriajeNN,
    filterTriaje,
    TriajeByViewTable,
    statusTriaje,
    TriajePriority,
    EditTriaje,
    statusTriajeAdmision
}