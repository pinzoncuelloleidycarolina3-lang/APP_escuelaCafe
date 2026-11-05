# 🛠️ Manual de Instalación y Despliegue - Escuela Café

## 1. Descripción del Proyecto
Este documento describe el proceso de despliegue de la plataforma **Escuela Café**. Aunque el desarrollo local se realiza con Node.js y React, la arquitectura de despliegue en producción (según los estándares de las clases) está diseñada para utilizar **Docker, Nginx y Locust**.

## 2. Arquitectura del Sistema
- **Desarrollo Local:**
  - Frontend: React + Vite (Puerto 5173)
  - Backend: Node.js + Express (Puerto 3000)
  - Base de Datos: MongoDB Atlas (NoSQL)
- **Arquitectura de Producción (Requerida en clase):**
  - **Proxy Inverso / Balanceador:** Nginx (Puerto 80)
  - **Backend:** 4 réplicas del servidor Node.js (Docker Compose)
  - **Observabilidad:** Dozzle (Puerto 8080)
  - **Pruebas de Carga:** Locust (Puerto 8089)

## 3. Prerrequisitos de Software
* **Node.js** (v18.0 o superior) - Para desarrollo local.
* **Docker Engine** (v20.10 o superior) - Para despliegue en producción.
* **Docker Compose** (v2.0 o superior)
* **Git**

---

## 4. Pasos de Instalación (Entorno Local - Node.js)
Para probar el proyecto en tu computadora, sigue estos pasos:

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/pinzoncuelloleidycarolina3-lang/APP_escuelaCafe.git
cd APP_escuelaCafe  


 
---
### Paso 2: ingresar a la carpeta del proyecto y abrir el editor 
navega hacia la carpeta que acabas de descargar:

cd APP_escuelaCafe

(Opcional pero recomendado) Abra el proyecto en Visual Studio Code con el comando:
code . 

Paso 3: Abrir la Terminal Integrada en VS Code
En Visual Studio Code, abra la terminal integrada presionando Ctrl + ` o yendo al menú superior Terminal > Nueva Terminal.

Paso 4: Configuración de Variables de Entorno (Backend)
En esta primera terminal, navegue a la carpeta interna del backend (el proyecto tiene una carpeta anidada):

```bash
cd backend/backend

Cree un archivo llamado .env (con el punto al inicio) en esta carpeta y pegue el siguiente contenido con las credenciales:

PORT=3000
MONGODB_URI=mongodb+srv://pinzoncuelloleidycarolina3_db_user:carolina21@cluster0.1doow3f.mongodb.net/escuela_cafe
JWT_SECRET=escuela_cafe_secreto_super_seguro_2026

Paso 5: Instalar dependencias y arrancar el Backend
Estando en la carpeta backend/backend, ejecute los siguientes comandos:

```bash
npm install
npm run dev

✅ Verificación: Debe aparecer en pantalla MongoDB conectado correctamente y Servidor corriendo en http://localhost:3000. Deje esta terminal abierta y no la cierre.

Paso 6: Arrancar el Frontend (Segunda Terminal)
Para no apagar el backend, abra una NUEVA terminal en VS Code (puede usar el atajo Ctrl + Shift + ñ o el botón + en la barra de terminales).
Desde la raíz del proyecto, navegue a la carpeta del frontend:

```bash 
cd frontend

instale las dependencias y arranque la interfaz 

```bash 
npm install 
npm run dev 

Verificación: Debe aparecer Local: http://localhost:5173/ (o 5174).

Paso 7: Acceso al sistema y Smoke Tests
Abra su navegador web y diríjase a http://localhost:5173. Inicie sesión con las cuentas de prueba:

Instructor: test@example.com / password123

Estudiante: sofia@gmail.com / 12345678

Para verificar la conectividad del Backend, abra otra pestaña y visite http://localhost:3000/api/health. Debe devolver un JSON con "status": "OK".

## -. Despliegue Opcional en Producción (Docker - Clases Anteriores)
*(Nota: Esta sección es teórica y sirve como guía para un entorno de producción. Para probar el proyecto en local, solo siga los pasos de la Sección 4).*

Despliegue en Producción (Docker - Clases Anteriores)
Si desea desplegar la aplicación utilizando la arquitectura de 4 réplicas con Nginx, Locust y Dozzle, siga estos pasos:

Paso 1: Levantar la infraestructura en Docker
bash
docker compose up --build -d --scale app=4
Paso 2: Verificación del despliegue
Verificar estado de contenedores:

bash
docker compose ps
Acceso a consolas:

Dozzle (Logs): http://localhost:8080

Locust (Pruebas de Carga): http://localhost:8089

6. Comandos de Operación Diaria
Ver logs (Local): Revisar la terminal del backend (Nodemon muestra los errores en tiempo real).

Ver logs (Docker): docker compose logs -f api-backend

Apagar entorno local: Presionar Ctrl + C en ambas terminales.

Apagar entorno Docker: docker compose down

Actualizar sin tiempo de inactividad (Docker): docker compose up --build -d --no-deps --force-recreate api-backend

7. Flujo de Trabajo en Git (Convención de Commits)
Para garantizar la trazabilidad del proyecto y el cumplimiento de los estándares de la industria, el equipo utiliza una convención estricta para los mensajes de commit.

Estructura de un Commit
Todos los commits deben seguir el formato: <tipo>(<alcance>): <descripción>

Tipos permitidos: feat (funcionalidad), fix (corrección), docs (documentación), ci (integración continua), refactor.

## 7. Flujo de Trabajo en Git (Convención de Commits)

Para garantizar la trazabilidad del proyecto y el cumplimiento de los estándares de la industria (y los requerimientos del SENA), el equipo utiliza una convención estricta para los mensajes de commit. Esto permite saber exactamente qué Historia de Usuario (HU) se está desarrollando o corrigiendo.

### Estructura de un Commit
Todos los commits deben seguir el formato: `<tipo>(<alcance>): <descripción>`

*   **Tipos permitidos:**
    *   `feat`: Nueva funcionalidad (ej. un endpoint, una vista).
    *   `fix`: Corrección de un error o bug.
    *   `docs`: Cambios en la documentación (como este manual).
    *   `ci`: Cambios en la configuración de integración continua.
    *   `refactor`: Mejoras en el código que no cambian su comportamiento.

### Comandos básicos para el equipo de desarrollo
Si eres miembro del equipo y vas a subir cambios, este es el flujo a seguir:

1. **Traer los últimos cambios del repositorio:**
   ```bash
   git pull origin main