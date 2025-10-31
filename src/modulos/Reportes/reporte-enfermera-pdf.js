const PDFDocument = require("pdfkit-table");
const path = require("path");


function generarEnfermeraPDF(data, res) {
    try {
        // Crear documento PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
            bufferPages: true // ✅ Corregido (antes estaba mal escrito)
        });
        // Configurar headers para descarga
        // 🕓 Crear nombre del archivo con código y fecha
        const codigo = data.codigo || 'enfermera';
        const fecha = new Date().toLocaleString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/Lima'
        })
            .replace(/[\/,]/g, '-')   // elimina "/" y ","
            .replace(/\s+/g, '_')     // espacios → guiones bajos
            .replace(':', '-');
        const nombreArchivo = `Reporte_${codigo}_${fecha}.pdf`;
        // 📄 Configurar headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

        // Pipe directo a la respuesta HTTP (sin guardar archivo)
        const stream = doc.pipe(res);
        stream.on('error', err => {
            console.error('Error al enviar PDF:', err);
            res.end();
        });

        // ======== CONTENIDO DEL PDF ========
        // ==== 🔹 FUNCIÓN PARA AGREGAR LOS LOGOS ====
        const agregarEncabezado = () => {
            try {
                const pageWidth = doc.page.width;
                const logoIzq = path.join(__dirname, "../.././img/Imagen1.png");
                const logoDer = path.join(__dirname, "../.././img/logoHospital.png");

                doc.image(logoIzq, 20, 20, { fit: [250, 200] });
                doc.image(logoDer, pageWidth - 70, 10, { fit: [80, 80] });
            } catch (err) {
                console.warn("⚠️ No se pudieron cargar los logos:", err.message);
            }
        };

        // Agregar logos a la primera página
        agregarEncabezado();

        // Agregar logos automáticamente en cada nueva página
        doc.on('pageAdded', () => {
            agregarEncabezado();
            doc.moveDown(3);
        });
        // Encabezado principal
        doc.moveDown(2);
        doc
            .fontSize(20)
            .font('Helvetica-Bold')
            .text('REPORTE DE TURNO', { align: 'center' })
            .moveDown(0.5);

        doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Código: ${data.codigo ?? 'Sin código'}`, { align: 'center' })
            .text(`Fecha: ${data.fechaHora ? formatearFecha(data.fechaHora) : 'Sin fecha'}`, { align: 'center' })
            .moveDown(1);

        // Línea separadora
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(1);

        // ===== INFORMACIÓN GENERAL =====
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('INFORMACIÓN GENERAL', { underline: true })
            .moveDown(0.5);

        doc
            .fontSize(11)
            .font('Helvetica-Bold')
            .text('Encargado(a): ', { continued: true })
            .font('Helvetica')
            .text(limpiarTexto(data.encargadaNombre));

        doc
            .font('Helvetica-Bold')
            .text('DNI: ', { continued: true })
            .font('Helvetica')
            .text(limpiarTexto(data.encargadaDni));

        doc
            .font('Helvetica-Bold')
            .text('Turno: ', { continued: true })
            .font('Helvetica')
            .text(
                data.turno === 'M'
                    ? 'Mañana'
                    : data.turno === 'T'
                        ? 'Tarde'
                        : data.turno === 'N'
                            ? 'Noche'
                            : 'No especificado'
            )
            .moveDown(1);

        // ===== PERSONAL DEL TURNO =====
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('PERSONAL DEL TURNO', { underline: true })
            .moveDown(0.5);

        // Enfermeras
        if (Array.isArray(data.enfermerasTurno) && data.enfermerasTurno.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').text('Enfermeras:').moveDown(0.3);
            data.enfermerasTurno.forEach((enfermera, index) => {
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`${index + 1}. ${limpiarTexto(enfermera.nombreCompleto)} - DNI: ${limpiarTexto(enfermera.dnis)}`);
            });
            doc.moveDown(0.5);
        }

        // Técnicas
        if (Array.isArray(data.tecnicasTurno) && data.tecnicasTurno.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').text('Técnicas:').moveDown(0.3);
            data.tecnicasTurno.forEach((tecnica, index) => {
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`${index + 1}. ${limpiarTexto(tecnica.nombreCompleto)} - DNI: ${limpiarTexto(tecnica.dnis)}`);
            });
            doc.moveDown(1);
        }

        // ===== DATOS DEL REPORTE =====
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('DATOS DEL REPORTE', { underline: true })
            .moveDown(0.5);

        doc
            .fontSize(10)
            .font('Helvetica')
            .text(data.datosReporte || 'Sin datos', { align: 'justify' })
            .moveDown(1);

        // ===== OBSERVACIONES =====
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('OBSERVACIONES', { underline: true })
            .moveDown(0.5);

        doc
            .fontSize(10)
            .font('Helvetica')
            .text(data.observaciones || 'Sin observaciones', { align: 'justify' })
            .moveDown(1);

        // ===== COMENTARIOS =====
        if (Array.isArray(data.comentarios) && data.comentarios.length > 0) {
            doc.addPage();
            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .text(`COMENTARIOS (${data.cantidadComentarios || data.comentarios.length})`, { underline: true })
                .moveDown(1);

            data.comentarios.forEach((comentario, index) => {
                // Salto de página si el texto se acerca al final
                if (doc.y > 700) doc.addPage();

                doc.fontSize(11).font('Helvetica-Bold').text(`Comentario #${index + 1}`, { underline: true }).moveDown(0.3);

                doc
                    .fontSize(9)
                    .font('Helvetica-Bold')
                    .text('Fecha: ', { continued: true })
                    .font('Helvetica')
                    .text(limpiarTexto(comentario.fecha));

                doc
                    .font('Helvetica-Bold')
                    .text('Nombre: ', { continued: true })
                    .font('Helvetica')
                    .text(limpiarTexto(comentario.nombre));

                doc
                    .font('Helvetica-Bold')
                    .text('DNI: ', { continued: true })
                    .font('Helvetica')
                    .text(limpiarTexto(comentario.dni));

                doc
                    .font('Helvetica-Bold')
                    .text('Razón: ', { continued: true })
                    .font('Helvetica')
                    .text(limpiarTexto(comentario.razon));

                doc
                    .font('Helvetica-Bold')
                    .text('Comentario: ')
                    .font('Helvetica')
                    .text(limpiarTexto(comentario.comentario), { align: 'justify' })
                    .moveDown(1);

                if (index < data.comentarios.length - 1) {
                    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);
                }
            });
        }

        // ===== FINALIZAR DOCUMENTO =====
        doc.end();

        // Cerrar el stream correctamente
        doc.on('finish', () => {
            res.end();
        });

    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        res.status(500).json({ ok: false, error: 'Error al generar el PDF' });
    }
}

// ===== FUNCIONES AUXILIARES =====
function limpiarTexto(texto) {
    if (texto === null || texto === undefined) return 'Sin dato';
    return String(texto).trim();
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

module.exports = { generarEnfermeraPDF };
