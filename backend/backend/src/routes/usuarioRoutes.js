const express = require("express");
const router = express.Router();
const { verificarToken, soloAdmin } = require("../middlewares/auth");

// Usuarios en memoria (temporal hasta conectar MySQL)
// TODO: reemplazar por consultas a la BD
const { usuarios } = require("../controllers/authController");

// GET /api/usuarios — listar todos los usuarios [solo Admin] (HU-03)
router.get("/", verificarToken, soloAdmin, (req, res) => {
  const lista = usuarios.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
  }));
  res.json(lista);
});

// PUT /api/usuarios/:id/rol — cambiar rol de un usuario [solo Admin] (HU-03)
router.put("/:id/rol", verificarToken, soloAdmin, (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  const rolesValidos = ["Admin", "Instructor", "Estudiante"];
  if (!rolesValidos.includes(rol)) {
    return res.status(400).json({ message: "Rol inválido" });
  }

  // TODO: reemplazar por UPDATE en tabla usuarios
  const usuario = usuarios.find((u) => u.id === parseInt(id));
  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  usuario.rol = rol;
  res.json({
    message: `Rol actualizado a ${rol}`,
    usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
  });
});

module.exports = router;
