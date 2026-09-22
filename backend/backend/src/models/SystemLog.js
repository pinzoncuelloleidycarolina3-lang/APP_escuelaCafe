const mongoose = require("mongoose");

const systemLogSchema = new mongoose.Schema(
  {
    fecha_hora: {
      type: Date,
      default: Date.now,
      required: true,
    },
    nivel: {
      type: String,
      enum: ["INFO", "WARNING", "ERROR"],
      required: true,
    },
    origen_ip: {
      type: String,
      required: true,
    },
    mensaje: {
      type: String,
      required: true,
    },
  },
  {
    collection: "system_logs",
    versionKey: false,
  }
);

module.exports = mongoose.model("SystemLog", systemLogSchema);
