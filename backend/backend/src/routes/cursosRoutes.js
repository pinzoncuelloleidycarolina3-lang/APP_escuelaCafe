const express = require("express");
const router = express.Router();
const {
  listarCursos,
  obtenerCurso,
  crearCurso,
  editarCurso,
  archivarCurso,
  agregarModulo,
  agregarLeccion,
} = require("../controllers/cursosController");
const {
  verificarToken,
  soloInstructor,
  soloAdmin,
} = require("../middlewares/auth");

// Rutas públicas
router.get("/", listarCursos); // GET  /api/cursos
router.get("/:id", obtenerCurso); // GET  /api/cursos/:id

// Rutas protegidas — requieren token
router.post("/", verificarToken, soloInstructor, crearCurso); // POST   /api/cursos
router.put("/:id", verificarToken, soloInstructor, editarCurso); // PUT    /api/cursos/:id
router.delete("/:id", verificarToken, soloAdmin, archivarCurso); // DELETE /api/cursos/:id

// Módulos y lecciones
router.post("/:id/modulos", verificarToken, soloInstructor, agregarModulo); // POST /api/cursos/:id/modulos
router.post(
  "/:id/modulos/:moduloId/lecciones",
  verificarToken,
  soloInstructor,
  agregarLeccion
); // POST /api/cursos/:id/modulos/:moduloId/lecciones

module.exports = router;
