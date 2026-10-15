const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const { registrarLog } = require("../utils/logger");

// HU-01: Registro de usuario
const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener mínimo 8 caracteres" });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hash,
      rol: "Estudiante",
    });
    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// HU-02: Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios" });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      await registrarLog(
        "WARNING",
        req.ip,
        `Intento de login fallido: correo no registrado (${email})`
      );
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      await registrarLog(
        "WARNING",
        req.ip,
        `Intento de login fallido: contraseña incorrecta para ${email}`
      );
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await registrarLog(
      "INFO",
      req.ip,
      `Login exitoso: ${usuario.email} (${usuario.rol})`
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono || "",
        biografia: usuario.biografia || "",
        foto: usuario.foto || null,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// GET /api/auth/perfil
const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      telefono: usuario.telefono || "",
      biografia: usuario.biografia || "",
      foto: usuario.foto || null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// PUT /api/auth/perfil — editar perfil
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono, biografia } = req.body;

    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (nombre) usuario.nombre = nombre.trim();
    if (telefono !== undefined) usuario.telefono = telefono.trim();
    if (biografia !== undefined) usuario.biografia = biografia.trim();

    await usuario.save();

    res.json({
      message: "Perfil actualizado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono,
        biografia: usuario.biografia,
        foto: usuario.foto,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

module.exports = {
  registro,
  login,
  perfil,
  actualizarPerfil,
};