# Proyecto: Biblioteca Digital Dante Alighieri

Este documento describe el plan de implementación propuesto para el desarrollo de la aplicación web de la Biblioteca Digital para la Dante Alighieri en La Habana, utilizando Strapi y Next.js.

## Decisiones Aprobadas

> [!NOTE]
> **Diseño y Estilos:** Se utilizará **Tailwind CSS** para agilizar el desarrollo de los componentes y mantener un código de UI consolidado en Next.js.

> [!NOTE]
> **Notificaciones:** Se priorizarán servicios gratuitos. Para correos, utilizaremos **Resend** (capa gratuita excelente). Para WhatsApp, se intentará usar la **Meta WhatsApp Cloud API**, que tiene cuota gratuita, dejando la arquitectura preparada en caso de que en Cuba requiera alguna integración distinta (ej. un bot local) por cuestiones de acceso.

> [!NOTE]
> **Panel de Administración (Bibliotecario):** Construiremos todo el flujo de gestión y renovación de préstamos directamente en el **Frontend** para mayor comodidad.

> [!NOTE]
> **Procesos de Préstamos:** El sistema dejará que el Bibliotecario sea el encargado de aprobar el préstamo físico, pero se implementará un **ajuste (toggle)** para permitir que en el futuro el proceso se vuelva 100% automático (la reserva aprueba el préstamo de inmediato). No existe base de datos previa, todo inicia desde cero.

## Proposed Changes

### Arquitectura General
El proyecto se dividirá en dos carpetas principales dentro de la ruta (monorepo lógico):
- `backend/`: Contendrá la aplicación Strapi.
- `frontend/`: Contendrá la aplicación web en Next.js.

### 1. Backend (Strapi)
Se inicializará un proyecto Strapi que usará SQLite en entorno de desarrollo local.
Contará con la configuración de plugins necesarios (ej. upload para Cloudinary).

#### Modelos de Datos (Content-Types) propuestos:
- **Book (Libro):** Título, Autor, Nivel, Idioma, Portada (Media), Estado (Disponible, Prestado, etc.), ISBN.
- **Loan (Préstamo):** Relación con Libro, Relación con Usuario, Fecha de Préstamo, Fecha de Devolución Prevista, Estado.
- **User (Usuario):** Se extenderá el plugin de usuarios de Strapi para definir perfiles (estudiante, bibliotecario, administrador) añadiendo campos como número de contacto para WhatsApp.

### 2. Frontend (Next.js)
Se inicializará un proyecto Next.js (App Router).
Se creará un sistema de diseño premium, moderno y responsivo.

#### Pantallas Principales:
- **Inicio/Catálogo:** Cuadrícula interactiva de libros con filtros (idioma, nivel).
- **Detalle del Libro:** Ver estado y botón para reservar.
- **Dashboard (Usuarios):** Préstamos activos, historial, estado de cuenta.
- **Admin Panel (Opcional):** Aunque Strapi tiene su panel, se puede hacer en el frontend un acceso de bibliotecario para renovaciones y préstamos presenciales de manera más rápida.

### 3. Despliegue e Infraestructura
Dada la naturaleza de los servicios modernos de alojamiento, la configuración se hará de la siguiente forma a futuro:
- **Backend:** Se preparará un `Dockerfile` y archivos de configuración para despliegue nativo en Render o Railway, donde se podrá aprovisionar PostgreSQL fácilmente.
- **Frontend:** Listo para conectarse al repositorio y desplegar en Vercel.
- **Media:** Instalación y configuración del plugin de Cloudinary en Strapi.

### 4. Lógica de Préstamos Flexibles
Se agregará una configuración en el backend gestionable por el Administrador/Bibliotecario:
- **Modo Manual (Default):** El usuario hace la solicitud web -> El bibliotecario la revisa en el Panel Frontend y la aprueba al entregar el libro.
- **Modo Automático:** La solicitud web se aprueba automáticamente de existir stock.

## Verification Plan

### Manual Verification
- Levantar servidor Strapi y verificar la creación de modelos en su panel de administración.
- Levantar servidor Next.js y validar la conexión a la API de Strapi (GraphQL/REST).
- Simular un flujo completo en el entorno local antes del despliegue.
