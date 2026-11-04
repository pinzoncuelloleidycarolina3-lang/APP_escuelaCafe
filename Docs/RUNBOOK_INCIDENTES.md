# RUNBOOK DE INCIDENTES Y RESOLUCIÓN DE PROBLEMAS
**Proyecto:** Escuela Café
**Arquitectura de Despliegue (Simulada para Producción):** Frontend (React) + Backend (Node.js con 4 réplicas) + Nginx (Proxy Inverso) + MongoDB Atlas + Monitoreo (Dozzle y Locust).

Este documento es la guía oficial de respuesta rápida para diagnosticar y resolver incidentes en el sistema, garantizando la continuidad del servicio.

---

##  Incidente 1: Error 502 Bad Gateway en el Frontend
**Síntoma:** Al intentar iniciar sesión o cargar la página, el navegador muestra un error 502 y la consola dice `Failed to load resource`.
**Causa Probable:** Nginx no puede comunicarse con las réplicas del Backend (Node.js).
**Diagnóstico:**
1. Abrir **Dozzle** (Monitor de Docker) en `http://localhost:8080`.
2. Revisar los logs del contenedor de Nginx y de las réplicas de Node.js.
3. Verificar el estado de los contenedores ejecutando `docker-compose ps` en la terminal.
**Solución:**
1. Si las réplicas están caídas, reiniciar el servicio con: `docker-compose restart backend`.
2. Verificar que el archivo `nginx.conf` apunte al puerto correcto (3000).
3. Si el problema persiste, escalar las réplicas: `docker-compose up -d --scale backend=4`.

##  Incidente 2: El Backend no arranca (Error de conexión a Base de Datos)
**Síntoma:** La terminal muestra `Error al conectar a MongoDB: connect ETIMEDOUT` o `Authentication failed`.
**Causa Probable:** La IP del servidor no está autorizada en MongoDB Atlas o las credenciales del `.env` son incorrectas.
**Diagnóstico:**
1. Revisar que el archivo `.env` tenga la URL correcta de MongoDB (`MONGODB_URI`).
2. Verificar en MongoDB Atlas (Network Access) si la IP del contenedor/servidor está en la lista.
**Solución:**
1. Entrar a MongoDB Atlas > Network Access.
2. Agregar la IP actual o permitir el acceso temporal (`0.0.0.0/0`).
3. Reiniciar el backend (`docker-compose restart backend`).

##  Incidente 3: Fallo en las pruebas de carga (Locust)
**Síntoma:** Al ejecutar Locust simulando 100 usuarios concurrentes, la tasa de errores HTTP 500 supera el 1%.
**Causa Probable:** Cuello de botella en la base de datos o límite de conexiones excedido en Node.js.
**Diagnóstico:**
1. Revisar las métricas de rendimiento en los logs de Node.js.
2. Verificar el uso de CPU y RAM en Dozzle.
**Solución:**
1. Verificar que el "Pool de conexiones" de Mongoose esté configurado para soportar las 4 réplicas.
2. Si es necesario, escalar verticalmente la base de datos en MongoDB Atlas (aumentar el tier).

##  Incidente 4: Token JWT Expirado (Error 401 Unauthorized)
**Síntoma:** El usuario es redirigido al Login de forma repentina al intentar ver "Mis Cursos" o el "Panel Instructor".
**Causa Probable:** El token JWT emitido por el backend tiene un tiempo de vida de 24 horas y ha expirado.
**Solución:**
1. En el Frontend, hacer clic en "Cerrar sesión" para borrar el token viejo del `localStorage`.
2. Volver a iniciar sesión para generar un nuevo token de acceso.
3. (Para desarrolladores) Verificar que el `JWT_SECRET` en el `.env` no haya cambiado.

##  Incidente 5: El servicio Frontend se cae o da error de módulos
**Síntoma:** Vite o el navegador muestran `Cannot find module` o `Failed to resolve import`.
**Causa Probable:** Las dependencias no están instaladas o se borró algún archivo `.jsx`.
**Diagnóstico:**
1. Revisar la terminal del Frontend.
**Solución:**
1. Detener el proceso (`Ctrl + C`).
2. Eliminar la carpeta `node_modules` y ejecutar `npm install`.
3. Volver a iniciar con `npm run dev`.