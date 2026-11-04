const express = require("express");
const router = express.Router();
const {
  registro,
  login,
  perfil,
  actualizarPerfil,
} = require("../controllers/authController");
const { verificarToken } = require("../middlewares/auth");

// Rutas públicas
router.post("/registro", registro);
router.post("/login", login);

// Rutas protegidas — requieren token válido
router.get("/perfil", verificarToken, perfil);
router.put("/perfil", verificarToken, actualizarPerfil);

module.exports = router;