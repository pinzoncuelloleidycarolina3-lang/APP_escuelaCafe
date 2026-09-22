require("dotenv").config();
const app = require("./app");
const conectarDB = require("./config/db");

const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || "desarrollo"}`);
  });
});
