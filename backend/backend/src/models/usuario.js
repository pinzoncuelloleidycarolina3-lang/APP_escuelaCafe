const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ["Estudiante", "Instructor", "Admin"],
      default: "Estudiante",
    },
    // ===== NUEVOS CAMPOS =====
    telefono: {
      type: String,
      default: "",
    },
    biografia: {
      type: String,
      default: "",
      maxlength: 300,
    },
    foto: {
      type: String,
      default: null, // URL de la foto (más adelante)
    },
  },
  {
    timestamps: true,
    collection: "usuarios",
  }
);

module.exports = mongoose.model("usuario", usuarioSchema);