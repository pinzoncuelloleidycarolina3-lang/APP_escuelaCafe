const mongoose = require("mongoose");

const leccionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tipo: {
    type: String,
    enum: ["Texto", "Video", "PDF"],
    required: true,
  },
  contenido_url: { type: String, default: null },
  orden: { type: Number, required: true },
});

const moduloSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  orden: { type: Number, required: true },
  lecciones: [leccionSchema],
});

const cursoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    nivel: {
      type: String,
      enum: ["Basico", "Intermedio", "Avanzado"],
      required: true,
    },
    precio: { type: Number, required: true, min: 0 },
    duracion_horas: { type: Number, default: 0 },
    cupos_max: { type: Number, default: 20 },
    cupos_disponibles: { type: Number, default: 20 },
    estado: {
      type: String,
      enum: ["Borrador", "Publicado", "Archivado"],
      default: "Borrador",
    },
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    instructor: { type: String, required: true },
    modulos: [moduloSchema],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "cursos",
  }
);

module.exports = mongoose.model("Curso", cursoSchema);