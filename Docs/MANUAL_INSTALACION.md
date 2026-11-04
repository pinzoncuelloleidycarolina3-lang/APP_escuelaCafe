# MANUAL DE INSTALACIÓN Y DESPLIEGUE - ESCUELA CAFÉ

**Proyecto:** Escuela Café (Plataforma educativa)
**Stack:** Node.js (Backend) + React/Vite (Frontend) + MongoDB Atlas (Base de Datos).

## 📖 1. Descripción General del Proyecto (¿Cómo funciona?)
**Escuela Café** es una plataforma educativa tipo *Classroom* diseñada para gestionar cursos de emprendimiento. Su arquitectura es **Cliente-Servidor (Full Stack)**:

*   **Frontend (React + Vite):** Es la interfaz gráfica (puerto 5173). Se comunica con el backend mediante peticiones HTTP (Axios) y guarda el token de sesión en el `localStorage`.
*   **Backend (Node.js + Express):** Es el "cerebro" (puerto 3000). Contiene la lógica de negocio, validaciones de seguridad (JWT) y control de acceso.
*   **Base de Datos (MongoDB Atlas):** Base de datos NoSQL en la nube donde se guardan las colecciones de `usuarios`, `cursos`, `carritos`, `inscripciones` y `system_logs`.

---

## 🛠️ 2. Requisitos Previos (Antes de empezar)
Asegúrate de tener instalado:
1. **Node.js** (Versión 18 o superior). Verifícalo con: `node -v`
2. **Git**. Verifícalo con: `git --version`
3. **Visual Studio Code** (o cualquier editor).
4. **Conexión a Internet**.

---

## 🚀 3. Clonar el Repositorio
1. Abre una terminal (PowerShell en Windows).
2. Ejecuta:
   ```bash
   git clone https://github.com/pinzoncuelloleidycarolina3-lang/APP_escuelaCafe.git