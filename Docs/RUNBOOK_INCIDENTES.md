
---

```markdown
#  RUNBOOK DE INCIDENTES - ARQUITECTURA DOCKER FLASK

Este documento es la guía oficial de respuesta rápida para diagnosticar y resolver incidentes en el entorno de producción basado en contenedores.

## Incidente 1: Error 502 Bad Gateway en el navegador
**Síntoma:** Al intentar acceder a la aplicación, Nginx muestra un error 502.
**Causa Probable:** Nginx no puede comunicarse con las réplicas de Flask (los contenedores de la app están caídos o reiniciándose).
**Diagnóstico:**
1. Ingresar a Dozzle (`http://localhost:8080`) y filtrar por el contenedor de Nginx.
2. Revisar los logs de las réplicas de Flask en Dozzle buscando errores en Python.
**Resolución:**
1. Ejecutar `docker compose logs app` para ver el error detallado.
2. Si hay un error en el código, corregirlo.
3. Reiniciar la arquitectura completa: `docker compose down` y luego `docker compose up -d --scale app=4`.

## Incidente 2: El contenedor de la App se detiene inesperadamente (OOM)
**Síntoma:** Dozzle muestra que una o varias réplicas de Flask se detuvieron de repente.
**Causa Probable:** Out Of Memory (OOM). El contenedor excedió el límite de memoria RAM asignado.
**Resolución:**
1. Revisar el consumo actual con: `docker stats`.
2. Si el consumo es muy alto, ajustar los límites en el `docker-compose.yml` bajo la etiqueta `deploy.resources.limits.memory`.
3. Reiniciar el servicio: `docker compose restart app`.

##  Incidente 3: Fallo en el Pipeline de GitHub Actions (CI/CD)
**Síntoma:** En la pestaña "Actions" de GitHub, el workflow `deploy.yml` muestra un tache rojo 
**Causa Probable:** Fallo en la autenticación SSH, falta de una variable secreta, o error de sintaxis en el archivo YAML.
**Resolución:**
1. Entrar a GitHub -> Actions -> Hacer clic en el workflow fallido.
2. Leer el paso exacto donde se detuvo.
3. Validar en GitHub (Settings -> Secrets and variables -> Actions) que las llaves SSH y las IPs estén correctamente guardadas.

##  Incidente 4: Locust reporta Timeouts masivos en la prueba de carga
**Síntoma:** Al correr las pruebas de estrés con Locust, la tasa de fallos supera el 5%.
**Causa Probable:** Nginx no está balanceando bien la carga o el Pool de conexiones está saturado.
**Resolución:**
1. Revisar el archivo `default.conf` (Nginx) para asegurarse de que apunte correctamente al servicio `app` de Docker Compose.
2. Verificar que las 4 réplicas estén activas con `docker compose ps`.
3. Escalar horizontalmente a 8 réplicas temporalmente: `docker compose up -d --scale app=8`.

##  Incidente 5: Pérdida de acceso a Dozzle (puerto 8080)
**Síntoma:** La URL `http://localhost:8080` no carga.
**Causa Probable:** El contenedor de Dozzle se cayó o el puerto está ocupado.
**Resolución:**
1. Verificar si el contenedor está corriendo: `docker compose ps`.
2. Si el estado es "Exit", levantarlo de nuevo: `docker compose up -d dozzle`.