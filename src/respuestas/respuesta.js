exports.success = function (req, res, mensaje, status = 200) {
  res.status(status).json({
    ok: true,
    error: null,
    body: mensaje,
  });
};

exports.error = function (req, res, err, defaultStatus = 500) {
  const errorInfo = {};

  // Mensaje de error
  errorInfo.message = err.message || 'Error interno';

  // Código de error (acepta code o codigo)
  if (err.code) {
    errorInfo.code = err.code;
  } else if (err.codigo) {
    errorInfo.code = err.codigo;
  }

  // Si viene un error SQL de mssql/tedious
  if (err.originalError) {
    errorInfo.originalError = {
      message: err.originalError.message,
      code: err.originalError.code,
    };
  }

  // Detalles extra si es un objeto sin message
  if (typeof err === 'object' && !err.message && Object.keys(err).length > 0) {
    errorInfo.details = err;
  }

  // Usar el status específico si lo tiene el error
  const status = err.status || defaultStatus;

  res.status(status).json({
    ok: false,
    error: errorInfo,
    body: null,
  });
};
