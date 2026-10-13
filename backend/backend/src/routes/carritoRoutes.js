const express = require("express");
const router = express.Router();
const {
  verCarrito,
  agregarAlCarrito,
  quitarDelCarrito,
  checkout,
  misInscripciones,
} = require("../controllers/carritoController");
const { verificarToken } = require("../middlewares/auth");

// Todas las rutas requieren autenticación
router.get("/", verificarToken, verCarrito);
router.post("/agregar", verificarToken, agregarAlCarrito);
router.delete("/:itemId", verificarToken, quitarDelCarrito);
router.post("/checkout", verificarToken, checkout);
router.get("/inscripciones", verificarToken, misInscripciones);

module.exports = router;