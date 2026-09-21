const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  // El header debe venir como: Bearer <token>
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, nombre, email, rol }
    next();
  } catch (error) {
    console.error("Error verificando token:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Middleware para restringir por rol
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "Admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado: se requiere rol Admin" });
  }
  next();
};

const soloInstructor = (req, res, next) => {
  if (req.usuario.rol !== "Instructor" && req.usuario.rol !== "Admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado: se requiere rol Instructor" });
  }
  next();
};

module.exports = { verificarToken, soloAdmin, soloInstructor };
