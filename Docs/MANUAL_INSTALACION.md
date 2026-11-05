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