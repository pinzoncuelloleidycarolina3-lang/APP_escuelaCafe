const express = require("express");
const router = express.Router();
const { registro, login, perfil } = require("../controllers/authController");
const { verificarToken } = require("../middlewares/auth");

// Rutas públicas
router.post("/registro", registro);
router.post("/login", login);

// Ruta protegida — requiere token válido
router.get("/perfil", verificarToken, perfil);

module.exports = router;
