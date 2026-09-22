const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { registrarLog } = require("../utils/logger");

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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios" });
    }

    const usuario = await Usuario.findOne({ email });

    //  Caso 1: el usuario no existe
    if (!usuario) {
      await registrarLog(
        "WARNING",
        req.ip,
        `Intento de login fallido: correo no registrado (${email})`
      );
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    // Caso 2: contraseña incorrecta
    if (!passwordValido) {
      await registrarLog(
        "WARNING",
        req.ip,
        `Intento de login fallido: contraseña incorrecta para ${email}`
      );
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Caso 3: login exitoso
    await registrarLog("INFO", req.ip, `Login exitoso para ${email}`);

    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    //  Caso 4: error inesperado del servidor
    await registrarLog("ERROR", req.ip, `Error en login: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

const perfil = async (req, res) => {
  try {
    const { id, nombre, email, rol } = req.usuario;
    res.json({ id, nombre, email, rol });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

module.exports = { registro, login, perfil };
