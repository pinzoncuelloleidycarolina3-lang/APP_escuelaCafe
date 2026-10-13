const mongoose = require("mongoose");

const inscripcionSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    curso_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curso",
      required: true,
    },
    titulo_curso: { type: String, required: true },
    instructor: { type: String, required: true },
    precio_pagado: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["Activo", "Completado", "Cancelado"],
      default: "Activo",
    },
    progreso: { type: Number, default: 0, min: 0, max: 100 },
    fecha_inscripcion: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "inscripciones",
  }
);

// Un usuario no puede inscribirse 2 veces al mismo curso
inscripcionSchema.index({ usuario_id: 1, curso_id: 1 }, { unique: true });

module.exports = mongoose.model("Inscripcion", inscripcionSchema);