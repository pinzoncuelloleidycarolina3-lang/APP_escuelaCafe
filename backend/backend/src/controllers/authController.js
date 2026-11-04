const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

// ==========================================
// REGISTRO DE USUARIO (CON SELECTOR DE ROL)
// ==========================================
const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

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

    // Si el frontend envía "Instructor", lo guardamos así. Si no, es Estudiante.
    const rolFinal = rol === "Instructor" ? "Instructor" : "Estudiante";

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hash,
      rol: rolFinal,
    });
    
    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// ==========================================
// LOGIN DE USUARIO
// ==========================================
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
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
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
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// ==========================================
// OBTENER PERFIL
// ==========================================
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

// ==========================================
// ACTUALIZAR PERFIL
// ==========================================
const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { nombre, email, password_actual, password_nuevo } = req.body;

    // Actualizar nombre
    if (nombre && nombre.trim()) {
      usuario.nombre = nombre.trim();
    }

    // Actualizar email (validando que no exista)
    if (email && email !== usuario.email) {
      const existe = await Usuario.findOne({ email });
      if (existe) {
        return res
          .status(400)
          .json({ message: "Ese email ya está registrado por otro usuario" });
      }
      usuario.email = email;
    }

    // Cambio de contraseña
    if (password_nuevo) {
      if (!password_actual) {
        return res
          .status(400)
          .json({ message: "Debes ingresar tu contraseña actual" });
      }

      const valida = await bcrypt.compare(password_actual, usuario.password);
      if (!valida) {
        return res
          .status(400)
          .json({ message: "La contraseña actual es incorrecta" });
      }

      if (password_nuevo.length < 8) {
        return res
          .status(400)
          .json({ message: "La nueva contraseña debe tener mínimo 8 caracteres" });
      }

      usuario.password = await bcrypt.hash(password_nuevo, 10);
    }

    await usuario.save();

    res.json({
      message: "Perfil actualizado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error.message);
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// ==========================================
// EXPORTACIONES (¡Esto es lo que faltaba!)
// ==========================================
module.exports = {
  registro,
  login,
  perfil,
  actualizarPerfil,
};