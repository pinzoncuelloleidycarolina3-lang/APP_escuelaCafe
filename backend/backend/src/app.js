const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Escuela Café API funcionando",
    version: "1.0.0",
    proyecto: "Escuela Café",
  });
});

module.exports = app;
