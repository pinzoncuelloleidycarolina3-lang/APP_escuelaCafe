#  Manual de Instalación y Despliegue - Escuela Café

## 1. Descripción del Proyecto
Este documento describe el proceso de despliegue de la plataforma **Escuela Café**, configurada en una arquitectura Cliente-Servidor (Full Stack) para entorno local. La arquitectura incluye separación de responsabilidades, autenticación JWT y trazabilidad de eventos.

## 2. Arquitectura del Sistema
- **Frontend (Interfaz):** React + Vite (Puerto 5173)
- **Backend (API REST):** Node.js + Express (Puerto 3000)
- **Base de Datos:** MongoDB Atlas (NoSQL en la nube)
- **Observabilidad:** Logs en consola (morgan) y colección `system_logs` en MongoDB.

## 3. Prerrequisitos de Software
Antes de iniciar, asegúrese de tener instalado:
* **Node.js** (v18.0 o superior)
* **npm** (incluido con Node.js)
* **Git**
* Sistema Operativo: Windows 11, macOS o Linux Ubuntu 22.04.
* **Conexión a Internet** (para conectar con MongoDB Atlas).

## 4. Pasos de Instalación

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/pinzoncuelloleidycarolina3-lang/APP_escuelaCafe.git
cd APP_escuelaCafe