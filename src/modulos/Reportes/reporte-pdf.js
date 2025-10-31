// reporte-triaje-pdf.js
const PDFDocument = require("pdfkit-table");
const path = require("path");

function generarPDF(datos, filtros, res) {
    const doc = new PDFDocument({ margin: 20, size: "A4", layout: "landscape" });

    // Nombre dinámico con rango de fechas si existen
    let nombreArchivo = "reporte-triajes.pdf";
    if (filtros.FechaInicio && filtros.FechaFin) {
        nombreArchivo = `reporte-triajes-${filtros.FechaInicio}-a-${filtros.FechaFin}.pdf`;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${nombreArchivo}`);

    doc.pipe(res);

    // ====== LOGOS SUPERIORES ======
    try {
        doc.image(path.join(__dirname, "../.././img/Imagen1.png"), 20, 20, { fit: [250, 200] });

        const pageWidth = doc.page.width;
        doc.image(
            path.join(__dirname, "../.././img/logoHospital.png"),
            pageWidth - 70,
            10,
            { fit: [80, 80] }
        );
    } catch (err) {
        console.warn("⚠️ No se pudieron cargar los logos:", err.message);
    }

    // ====== Título general ======
    doc.moveDown(3);
    doc.fontSize(16).text("Reporte de Triajes", { align: "center" });
    doc.moveDown(1);

    // ====== Filtros en narrativa ======
    doc.fontSize(12).text("Filtros aplicados:", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(10); // 👈 más pequeño

    const partes = [];

    if (filtros.NombreServicio && filtros.NombreServicio !== "Todos") {
        partes.push(["El servicio considerado es ", filtros.NombreServicio]);
    } else {
        partes.push(["Se han considerado ", "todos los servicios"]);
    }

    if (filtros.Prioridad && filtros.Prioridad !== "Todos") {
        partes.push(["La prioridad seleccionada es ", formatearPrioridad(filtros.Prioridad)]);
    } else {
        partes.push(["Se incluyeron ", "todas las prioridades"]);
    }

    if (filtros.TipoPaciente && filtros.TipoPaciente !== "Todos") {
        partes.push(["El tipo de paciente corresponde a ", formatearTipoPaciente(filtros.TipoPaciente)]);
    } else {
        partes.push(["Se han tomado en cuenta ", "todos los tipos de pacientes"]);
    }

    if (filtros.IdTipoEdad && filtros.IdTipoEdad !== "Todas") {
        partes.push(["La edad está expresada en ", formatearTipoEdad(filtros.IdTipoEdad)]);
    } else {
        partes.push(["Se han considerado ", "todas las formas de edad"]);
    }

    // Escribir narrativa con resaltados
    partes.forEach((p, i) => {
        resaltarTexto(doc, p[0], p[1]);
        if (i < partes.length - 1) doc.text(",", { continued: true });
    });
    doc.text("."); // cierre final
    doc.moveDown(1.5);

    // ====== Si no hay datos ======
    if (!datos.length) {
        doc.fontSize(12).text("No se encontraron registros con los filtros aplicados.");
        doc.end();
        return;
    }

    // ====== Tabla ======
    const headers = [
        { label: "N°", property: "nro", width: 30 },
        { label: "Fecha", property: "FechaHora", width: 80 },
        { label: "Nombre", property: "NombreCompleto", width: 180 },
        { label: "Documento", property: "NroDocumento", width: 100 },
        { label: "Edad", property: "edad", width: 50 },
        { label: "Tipos Edad", property: "TipoEdad", width: 80 },
    ];

    if (!filtros.IdServicio) {
        headers.push({ label: "Servicio", property: "NombreServicio", width: 140 });
    }

    if (!filtros.Prioridad) {
        headers.push({ label: "Prioridad", property: "Prioridad", width: 70 });
    }

    const table = {
        headers,
        datas: datos.map((item, index) => ({
            nro: index + 1,
            FechaHora: formatDateTime(item.FechaHora),
            NombreCompleto: item.NombreCompleto || "NN",
            NroDocumento: item.NroDocumento || "NN",
            edad: item.edad || "-",
            TipoEdad: formatearTipoEdad(item.TipoEdad) || "-",
            NombreServicio: item.NombreServicio || "NN",
            Prioridad: formatearPrioridad(item.Prioridad),
        })),
    };

    // Calcular ancho total de la tabla para centrar
    const totalTableWidth = headers.reduce((acc, h) => acc + (h.width || 0), 0);
    const pageWidth = doc.page.width - doc.options.margin * 2;
    const startX = (pageWidth - totalTableWidth) / 2;

    doc.table(table, {
        x: startX,
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(9),
        prepareRow: () => doc.font("Helvetica").fontSize(8),
    });

    doc.end();
}

// ===== Helpers =====
function resaltarTexto(doc, texto, resaltado) {
    doc.font("Helvetica").text(texto, { continued: true });
    doc.font("Helvetica-Bold").text(resaltado, { continued: true });
    doc.font("Helvetica"); // volver a normal
}

function formatDateTime(date) {
    if (!date) return "NN";
    const d = new Date(date);
    return `${d.toISOString().split("T")[0]} ${d.toISOString().split("T")[1].substring(0, 5)}`;
}

function formatearPrioridad(valor) {
    if (!valor) return "Todas";
    const mapa = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "No Emergencia" };
    return mapa[valor] || valor;
}

function formatearTipoEdad(valor) {
    if (!valor) return "Todas";
    const mapa = { 1: "Años", 2: "Meses", 3: "Días", 4: "Horas" };
    return mapa[valor] || valor;
}

function formatearTipoPaciente(valor) {
    if (!valor) return "Todos";
    const mapa = { REG: "Pacientes Registrados", NN: "Pacientes NN" };
    return mapa[valor] || valor;
}

module.exports = { generarPDF };
