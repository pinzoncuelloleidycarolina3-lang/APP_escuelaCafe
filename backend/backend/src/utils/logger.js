const SystemLog = require("../models/SystemLog");

/**
 * Registra un evento en la tabla de trazabilidad ciega (system_logs)
 * @param {string} nivel - 'INFO' | 'WARNING' | 'ERROR'
 * @param {string} ip - IP de origen
 * @param {string} mensaje - Descripción del evento
 */
async function registrarLog(nivel, ip, mensaje) {
  try {
    await SystemLog.create({
      nivel,
      origen_ip: ip || "desconocida",
      mensaje,
      fecha_hora: new Date(),
    });
  } catch (error) {
    console.error(" Error al registrar log:", error.message);
  }
}

module.exports = { registrarLog };
