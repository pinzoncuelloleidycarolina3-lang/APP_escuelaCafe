# 🛠️ Manual de Instalación y Despliegue - Docker Flask

## 1. Descripción del Proyecto
Este documento describe el proceso de despliegue de la API **Docker Flask**, configurada en un clúster local de Alta Disponibilidad utilizando Docker Compose. La arquitectura incluye balanceo de carga, límites de recursos y observabilidad en tiempo real.

## 2. Arquitectura del Sistema
- **Proxy Inverso / Balanceador:** Nginx (Puerto 80)
- **Backend:** Flask + Gunicorn (4 réplicas, Puerto interno 5000)
- **Base de Datos:** MySQL (configurada en el docker-compose)
- **Observabilidad:** Dozzle (Puerto 8080)
- **Pruebas de Carga:** Locust (Puerto 8089)

## 3. Prerrequisitos de Software
Antes de iniciar, asegúrese de tener instalado:
* **Docker Engine** (v20.10 o superior) - *En Windows se instala con Docker Desktop.*
* **Docker Compose** (v2.0 o superior)
* **Git**
* Sistema Operativo: Windows 11 (con WSL2) o Linux Ubuntu 22.04.

## 4. Pasos de Instalación

### Paso 1: Clonar el repositorio
Abra una terminal y ejecute:
```bash
git clone https://github.com/pinzoncuelloleidycarolina3-lang/docker_flask.git
cd docker_flask