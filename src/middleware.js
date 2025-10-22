const jwt = require("jsonwebtoken");
const SECRET_KEY = "clave_secreta_hospital"; // usar la misma clave

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ ok: false, error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1]; // quitar "Bearer"

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ ok: false, error: "Token inválido o expirado" });
    }
    req.user = decoded; // aquí guardamos { idEmpleado }
    next();
  });
}

module.exports = verificarToken;
