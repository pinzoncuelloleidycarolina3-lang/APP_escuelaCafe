# 🚨 RUNBOOK DE OPERACIONES E INCIDENTES
# ESCUELA CAFÉ

## 1. Propósito

Este documento es una guía de acción rápida dirigida al equipo de desarrollo para identificar, diagnosticar y solucionar posibles fallos en los entornos local y de producción de la plataforma educativa **Escuela Café**.

La aplicación está desarrollada utilizando Node.js, React y MongoDB Atlas.

El objetivo es facilitar la atención de incidentes, reducir los tiempos de respuesta y garantizar la disponibilidad y el correcto funcionamiento del sistema.

---

## 2. Atención de Incidentes

### 🛑 Incidente 1. El Backend (Node.js) se cae o no responde

**Descripción:**

El frontend muestra errores de red o, al realizar una solicitud a `http://localhost:3000/api/health`, se presenta un error de conexión. Las peticiones HTTP dejan de funcionar correctamente.

#### 2.1. Diagnóstico

Para identificar la causa del problema, realiza las siguientes verificaciones:

**1. Revisar la terminal del Backend**

Revisa la terminal donde se está ejecutando el Backend para identificar posibles errores fatales, como:

- `SyntaxError`
- `UnhandledPromiseRejection`

**2. Verificar si el proceso de Node.js está ejecutándose**

En Windows, abre una terminal y ejecuta:

```powershell
tasklist | findstr node
```

Este comando permite comprobar si existe algún proceso de Node.js activo en el sistema operativo.

#### 2.2. Mitigación

Según el problema identificado, realiza las siguientes acciones:

**Caso 1. Error de sintaxis**

Corrige el archivo `.js` afectado, guarda los cambios y Nodemon reiniciará automáticamente el servidor.

**Caso 2. Proceso bloqueado**

Detén el proceso utilizando `Ctrl + C` y reinicia el Backend:

```bash
npm run dev
```

**Caso 3. Puerto 3000 ocupado**

Ejecuta en una terminal de Windows como administrador:

```powershell
Stop-Process -Name node -Force
```

**Nota:** Este último comando detiene todos los procesos de Node.js activos, no solamente el que utiliza el puerto 3000. Úsalo únicamente cuando sea necesario.

---

### 🛑 Incidente 2. Error de conexión a MongoDB (ETIMEDOUT o Authentication Failed)

**Descripción:**

El Backend arranca, pero se cierra abruptamente o presenta el error `Error al conectar a MongoDB`. Las consultas a la base de datos fallan.

#### 2.1. Diagnóstico

Para identificar el problema:

1. Revisa los registros de la terminal del Backend para confirmar el tipo de error (`ETIMEDOUT` o `bad auth`).
2. Verifica la conexión a internet del computador, ya que MongoDB Atlas es una base de datos alojada en la nube.

#### 2.2. Mitigación

**Caso 1. Error `ETIMEDOUT` (problemas de conexión o acceso de red)**

Ingresa a MongoDB Atlas y dirígete a:

**Network Access → Add IP Address.**

Agrega la dirección IP pública actual de la red desde la cual se ejecuta el proyecto.

Para pruebas temporales, también existe la opción de permitir todas las direcciones IP mediante `0.0.0.0/0`, aunque no se recomienda mantener esta configuración por seguridad.

**Caso 2. Error `Authentication Failed`**

Revisa el archivo `.env`, ubicado en `backend/backend`, y verifica que la contraseña incluida en `MONGODB_URI` esté escrita correctamente.

También comprueba que el usuario de base de datos tenga permisos de acceso sobre `escuela_cafe`.

---

### 🛑 Incidente 3. Token JWT Expirado o Inválido (Error 401 Unauthorized)

**Descripción:**

El usuario intenta acceder al Panel de Instructor o a Mis Cursos y la aplicación lo devuelve a la pantalla de inicio de sesión (Login).

#### 3.1. Diagnóstico

1. Abre la consola del navegador presionando `F12`.
2. Dirígete a la pestaña **Network (Red)**.
3. Busca la petición que presentó el error, por ejemplo:

```http
GET /api/auth/perfil
```

4. Confirma si el código de respuesta HTTP es **401 Unauthorized**.

#### 3.2. Mitigación

1. En el frontend, haz clic en el botón **Cerrar sesión** para eliminar el token anterior almacenado en `localStorage`.
2. Vuelve a iniciar sesión con tus credenciales para generar un nuevo token válido.
3. Los tokens tienen una duración de 24 horas, según la configuración indicada para el proyecto.
4. Para desarrolladores, verifica que la variable `JWT_SECRET` del archivo `.env` no haya sido modificada y coincida con la configuración utilizada por el Backend.

---

### 🛑 Incidente 4. El Frontend no compila o presenta errores de módulos (Vite)

**Descripción:**

Al ejecutar `npm run dev` dentro de la carpeta `frontend`, la terminal muestra el error `Cannot find module` o el navegador presenta una pantalla en blanco.

#### 4.1. Diagnóstico

1. Abre la consola del navegador presionando `F12`.
2. Identifica si aparecen errores como:
   - `Failed to resolve import`
   - `Module not found`
3. Estos errores pueden indicar dependencias faltantes o problemas en las rutas de los archivos `.jsx`.

#### 4.2. Mitigación

**Paso 1. Detener el proceso**

Presiona `Ctrl + C` en la terminal donde se está ejecutando Vite.

**Paso 2. Eliminar las dependencias instaladas y el archivo de bloqueo**

Desde la carpeta `frontend`, ejecuta:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
```

**Paso 3. Reinstalar las dependencias**

Ejecuta los siguientes comandos por separado:

```bash
npm install
npm run dev
```

Esto permitirá reinstalar las dependencias y arrancar nuevamente el servidor de desarrollo.

---

## 3. Procedimiento de Emergencia: Rollback (Deshacer actualización)

Si una nueva versión del código genera un fallo crítico en producción que no puede solucionarse en menos de 10 minutos, se debe iniciar el procedimiento de recuperación.

### 3.1. Procedimiento de recuperación

**Paso 1. Volver a la rama principal estable de Git**

```bash
git checkout main
```

**Paso 2. Traer los últimos cambios de la rama principal**

```bash
git pull origin main
```

**Paso 3. Reiniciar los servidores**

Reinicia los servidores del Backend y del Frontend para aplicar la versión recuperada.

**Paso 4. Verificar el funcionamiento del sistema**

Abre el navegador y visita:

http://localhost:3000/api/health

Comprueba que el servicio responda correctamente y que la conexión con la base de datos esté establecida.

**Importante:** Los comandos anteriores actualizan el código con la última versión de `main`; no garantizan regresar a una versión anterior. Para realizar un rollback real, se debe identificar el último commit o etiqueta estable y recuperar esa versión.

---

## 4. Actualización del Runbook en GitHub

Una vez finalizada la documentación, guarda el archivo con el siguiente nombre y ubicación:

`Docs/RUNBOOK_INCIDENTES.md`

Para subir los cambios al repositorio de GitHub, abre una terminal desde la raíz del proyecto y ejecuta los siguientes comandos:

**Paso 1. Agregar el archivo**

```powershell
git add Docs/RUNBOOK_INCIDENTES.md
```

**Paso 2. Crear el commit**

```powershell
git commit -m "docs: actualizar runbook de incidentes final"
```

**Paso 3. Subir los cambios al repositorio**

```powershell
git push origin main
```

---

## 5. Recomendaciones Generales

Para prevenir incidentes y garantizar la estabilidad de Escuela Café, se recomienda:

1. Revisar periódicamente los registros del Backend.
2. Verificar que MongoDB Atlas esté disponible y correctamente configurado.
3. Mantener actualizadas las dependencias del proyecto.
4. No modificar las variables de entorno sin verificar su impacto.
5. Realizar pruebas después de cada actualización.
6. Mantener identificada una versión estable del proyecto para facilitar su recuperación.
7. Evitar compartir públicamente credenciales de acceso y archivos `.env`.

---

**Fin del Runbook de Operaciones e Incidentes – Escuela Café.**