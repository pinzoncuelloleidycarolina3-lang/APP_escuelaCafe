#  RUNBOOK DE OPERACIONES E INCIDENTES - ESCUELA CAFÉ

**Propósito:** Guía de acción rápida para el equipo de desarrollo frente a fallos en el entorno local o de producción de la plataforma educativa Escuela Café (Node.js + React + MongoDB Atlas).

---

##  Incidente 1: El Backend (Node.js) se cae o no responde
**Descripción:** El frontend muestra errores de red, o al hacer ping a `http://localhost:3000/api/health` da error de conexión. Las peticiones HTTP fallan.

###  Diagnóstico:
1. Revise la terminal donde corre el backend para ver si hay un error fatal (ej. `SyntaxError`, `UnhandledPromiseRejection`).
2. Verifique si el proceso de Node está corriendo en el sistema operativo:
   ```bash
   tasklist | findstr node