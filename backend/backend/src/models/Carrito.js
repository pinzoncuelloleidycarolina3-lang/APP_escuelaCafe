const mongoose = require("mongoose");

const itemCarritoSchema = new mongoose.Schema({
  curso_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso",
    required: true,
  },
  titulo: { type: String, required: true },
  precio: { type: Number, required: true },
  cantidad: { type: Number, default: 1 },
});

const carritoSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      unique: true, // Un carrito activo por usuario
    },
    items: [itemCarritoSchema],
    total: { type: Number, default: 0 },
    estado: {
      type: String,
      enum: ["Activo", "Pagado", "Cancelado"],
      default: "Activo",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "carritos",
  }
);

// Calcular total automáticamente antes de guardar
carritoSchema.pre("save", function (next) {
  this.total = this.items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  next();
});

module.exports = mongoose.model("Carrito", carritoSchema);