# 🛠️ MANUAL DE INSTALACIÓN Y DESPLIEGUE
# ESCUELA CAFÉ

## 1. Descripción del Proyecto

Este documento presenta los procedimientos necesarios para la instalación, configuración y ejecución de la plataforma **Escuela Café**.

El desarrollo local utiliza Node.js y React, mientras que la arquitectura de despliegue en producción contempla el uso de Docker, Nginx y Locust, de acuerdo con los estándares establecidos en clase.

El objetivo de este manual es facilitar la instalación del sistema y permitir que los instructores puedan ejecutar y verificar el funcionamiento de la aplicación.

---

## 2. Arquitectura del Sistema

### 2.1. Entorno de Desarrollo Local

- **Frontend:** React + Vite (Puerto 5173).
- **Backend:** Node.js + Express (Puerto 3000).
- **Base de Datos:** MongoDB Atlas (NoSQL).

### 2.2. Arquitectura de Producción (Requerida en clase)

- **Proxy Inverso / Balanceador:** Nginx (Puerto 80).
- **Backend:** 4 réplicas del servidor Node.js mediante Docker Compose.
- **Observabilidad:** Dozzle (Puerto 8080).
- **Pruebas de Carga:** Locust (Puerto 8089).

---

## 3. Prerrequisitos de Software

Antes de comenzar la instalación, es necesario contar con los siguientes programas:

| Software | Versión requerida | Uso |
|---|---|---|
| Node.js | v18.0 o superior | Desarrollo local |
| Docker Engine | v20.10 o superior | Despliegue en producción |
| Docker Compose | v2.0 o superior | Administración de contenedores |
| Git | Versión disponible | Clonación del repositorio |

También se recomienda tener instalado Visual Studio Code.

---

## 4. Pasos de Instalación (Entorno Local - Node.js)

Para ejecutar Escuela Café en un computador local, sigue los siguientes pasos.

### Paso 1. Clonar el repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/pinzoncuelloleidycarolina3-lang/APP_escuelaCafe.git
cd APP_escuelaCafe
```

### Paso 2. Abrir el proyecto en Visual Studio Code

Desde la carpeta del proyecto, ejecuta:

```bash
code .
```

### Paso 3. Abrir la terminal integrada

En Visual Studio Code, abre la terminal utilizando el atajo:

`Ctrl + \``

También puedes ingresar desde el menú superior:

**Terminal → Nueva Terminal.**

### Paso 4. Configurar las variables de entorno del Backend

En la terminal, navega hacia la carpeta interna del backend:

```bash
cd backend/backend
```

Crea un archivo llamado `.env` (incluyendo el punto al inicio).

Agrega la siguiente configuración:

```env
PORT=3000
MONGODB_URI=mongodb+srv://invitado_winbin:winbin123@cluster0.1doow3f.mongodb.net/escuela_cafe?retryWrites=true&w=majority
JWT_SECRET=escuela_cafe_secreto_super_seguro_2026
```

**Configuración de la conexión a MongoDB Atlas:**

La conexión utiliza un usuario independiente destinado a facilitar las pruebas del proyecto por parte de los instructores.

- **Usuario de base de datos:** `invitado_winbin`.
- **Base de datos:** `escuela_cafe`.
- **Servidor:** MongoDB Atlas.
- **Puerto del Backend:** 3000.

**Importante:**

1. El computador desde el cual se ejecutará el proyecto debe tener autorización de acceso en la configuración de red de MongoDB Atlas.
2. El usuario debe contar con permisos de lectura y escritura sobre la base de datos `escuela_cafe`.
3. El archivo `.env` debe permanecer en la carpeta `backend/backend`.
4. No se debe subir el archivo `.env` a GitHub ni compartir públicamente sus credenciales.
5. El secreto JWT debe mantenerse privado y utilizarse únicamente para esta configuración de evaluación.

### Paso 5. Instalar dependencias y ejecutar el Backend

Estando en la carpeta `backend/backend`, ejecuta:

```bash
npm install
npm run dev
```

**Verificación:**

Debe aparecer en la terminal el mensaje de conexión correcta a MongoDB y el servidor debe estar ejecutándose en:

http://localhost:3000

Deja esta terminal abierta mientras utilizas la aplicación.

### Paso 6. Instalar dependencias y ejecutar el Frontend

Abre una segunda terminal en Visual Studio Code.

Asegúrate de que esté ubicada en la carpeta raíz del proyecto.

Navega hacia la carpeta del frontend:

```bash
cd frontend
```

Instala las dependencias y ejecuta la interfaz:

```bash
npm install
npm run dev
```

**Verificación:**

Debe aparecer la dirección local:

http://localhost:5173/

En caso de que el puerto esté ocupado, Vite puede utilizar el puerto 5174.

### Paso 7. Acceder al sistema y realizar pruebas (Smoke Tests)

Una vez que el Backend y el Frontend estén ejecutándose correctamente, abre el navegador e ingresa a:

http://localhost:5173

Para comprobar el funcionamiento de los diferentes roles, utiliza las siguientes cuentas de prueba:

| Rol | Correo electrónico | Contraseña |
|---|---|---|
| Instructor | test@example.com | password123 |
| Estudiante | sofia@gmail.com | 12345678 |

**Verificación de conectividad del Backend**

Abre una nueva pestaña del navegador y visita:

http://localhost:3000/api/health

El servicio debe responder con un JSON que indique que el estado del servidor es correcto:

```json
{
  "status": "OK"
}
```

Con estas verificaciones se comprueba la disponibilidad del Backend y el acceso inicial a la plataforma.

**Nota:** Las cuentas de prueba deben estar previamente creadas en la base de datos para que el ingreso sea posible.

---

## 5. Despliegue Opcional en Producción (Docker)

**Nota:** Esta sección corresponde a la arquitectura de despliegue en producción trabajada en clases anteriores. Para ejecutar el proyecto en un computador local, se deben seguir los pasos de la sección 4.

Si se desea desplegar la aplicación utilizando Docker, Nginx, las cuatro réplicas del Backend, Dozzle y Locust, se deben realizar los siguientes procedimientos.

### Paso 1. Levantar la infraestructura en Docker

Desde la carpeta raíz del proyecto, ejecuta:

```bash
docker compose up --build -d --scale app=4
```

### Paso 2. Verificar el estado de los contenedores

Ejecuta:

```bash
docker compose ps
```

### Paso 3. Acceder a las herramientas de administración

Una vez desplegada la infraestructura, se puede acceder a:

- **Dozzle (Visualización de logs):** http://localhost:8080
- **Locust (Pruebas de carga):** http://localhost:8089

---

## 6. Comandos de Operación Diaria

### 6.1. Consultar los registros del sistema (Logs)

**Entorno local:**

Revisar la terminal del Backend, donde Nodemon muestra los errores y cambios en tiempo real.

**Entorno Docker:**

```bash
docker compose logs -f api-backend
```

### 6.2. Apagar el entorno local

Para detener la ejecución del proyecto:

- Dirigirse a la terminal del Backend.
- Presionar `Ctrl + C`.
- Repetir el procedimiento en la terminal del Frontend.

### 6.3. Apagar el entorno Docker

Ejecuta:

```bash
docker compose down
```

### 6.4. Actualizar el Backend en Docker

Para reconstruir y actualizar el servicio:

```bash
docker compose up --build -d --no-deps --force-recreate api-backend
```

---

## 7. Flujo de Trabajo en Git (Convención de Commits)

Para garantizar la trazabilidad del proyecto y cumplir con los estándares de la industria y los requerimientos del SENA, el equipo utiliza una convención para los mensajes de commit.

Esta metodología permite identificar las funcionalidades desarrolladas, las correcciones realizadas y los cambios en la documentación.

### 7.1. Estructura de un Commit

Todos los commits deben seguir el siguiente formato:

```bash
<tipo>(<alcance>): <descripción>
```

### 7.2. Tipos de commits permitidos

- **feat:** Nueva funcionalidad (ejemplo: un endpoint o una vista).
- **fix:** Corrección de un error o bug.
- **docs:** Modificaciones en la documentación.
- **ci:** Cambios en la configuración de integración continua.
- **refactor:** Mejoras en el código sin modificar su comportamiento.

### 7.3. Comandos básicos para el equipo de desarrollo

Si eres integrante del equipo y necesitas actualizar tu repositorio local con los últimos cambios, ejecuta:

**Paso 1. Traer los últimos cambios del repositorio**

```bash
git pull origin main
```

---

## 8. Recomendaciones de Seguridad

Para proteger la información y garantizar una instalación segura del proyecto, se deben tener en cuenta las siguientes recomendaciones:

1. No publicar contraseñas personales ni credenciales de MongoDB Atlas en GitHub.
2. Mantener el archivo `.env` fuera del repositorio.
3. Utilizar un archivo `.env.example` con valores de ejemplo para orientar la configuración.
4. No compartir claves JWT reales.
5. Utilizar cuentas de prueba destinadas exclusivamente a la evaluación.
6. Configurar los permisos de acceso a MongoDB Atlas de acuerdo con las necesidades del proyecto.
7. Cambiar o revocar las credenciales temporales cuando finalice el proceso de evaluación.

**Nota final:** Para ejecutar correctamente Escuela Café, es necesario tener configuradas las variables de entorno, las dependencias del proyecto y el acceso autorizado a la base de datos.

**Fin del manual.**
