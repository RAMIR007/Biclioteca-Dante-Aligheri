# Sistema de Biblioteca Dante Alighieri 📚🇮🇹

Un sistema integral de gestión bibliotecaria diseñado para la institución **Dante Alighieri**. Este proyecto digitaliza la administración del catálogo de libros (enfocado en el aprendizaje del idioma italiano), el control de préstamos, y automatiza la experiencia tanto para los estudiantes como para los bibliotecarios.

## 🌟 Características Principales

* **Catálogo Especializado**: Gestión de libros con niveles del Marco Común Europeo de Referencia (A1, A2, B1, B2, C1, C2) y clasificación de idiomas (Italiano, Español, Bilingüe).
* **Gestión de Préstamos**: Ciclo de vida completo para los préstamos (Pendiente, Activo, Devuelto, Vencido, Cancelado).
* **Automatización (Cron Jobs)**: Detección diaria de préstamos vencidos (`Overdue`) y envío automatizado de correos de alerta a los estudiantes (integración con *Resend*).
* **Dashboard del Estudiante**: Panel interactivo en el Frontend donde los alumnos pueden revisar sus libros actuales y extender la fecha de devolución (renovación) automáticamente con un clic (siempre y cuando el libro no esté reservado).
* **Panel de Administrador**: Interfaz de Strapi localizada al español, otorgando control total al bibliotecario para modificar inventarios, usuarios y sobreescribir estados de préstamos manualmente.

---

## 🛠️ Tecnologías Utilizadas

### Frontend (Dashboard y Catálogo)
* **Framework**: [Next.js](https://nextjs.org/) (App Router)
* **Lenguaje**: TypeScript
* **Estilos**: Tailwind CSS 

### Backend (API y Panel de Control)
* **Headless CMS**: [Strapi v4](https://strapi.io/)
* **Lenguaje**: TypeScript
* **Base de Datos**: SQLite (Por defecto para desarrollo)
* **Mailing**: [Resend](https://resend.com/) (para notificaciones transaccionales)

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu entorno local:
* **Node.js** (v18 o superior)
* **npm** o **yarn**

---

## ⚙️ Instalación y Ejecución Local

El repositorio está dividido en dos carpetas principales: `/backend` y `/frontend`. Ambos servidores deben ejecutarse simultáneamente.

### 1. Configuración del Backend (Strapi)

1. Abre una terminal y navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno. Copia el archivo `.env.example` a `.env` (si existe) o crea uno asegurándote de incluir tu API Key de Resend (si deseas probar los correos):
   ```env
   RESEND_API_KEY=tu_api_key_aqui
   ```
4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run develop
   ```
   *El panel de administrador estará disponible en `http://localhost:1337/admin`.*

### 2. Configuración del Frontend (Next.js)

1. Abre **otra** terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. (Opcional) Configura tus variables de entorno en un archivo `.env.local` si la API del backend se aloja en otra ruta distinta a localhost.
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible en `http://localhost:3000`.*

---

## 🔄 Flujo de Trabajo y Reglas de Negocio

### Renovación de Préstamos
Los estudiantes tienen acceso a un botón de **Solicitar Renovación** en su Dashboard:
- El botón realiza una validación hacia el backend (`POST /api/loans/:id/renew`).
- **Éxito**: Si el préstamo está activo y el libro **no** tiene reservas pendientes, se añaden automáticamente 7 días a la fecha de devolución.
- **Bloqueo**: Si el préstamo se encuentra "Vencido" (`Overdue`), el botón se deshabilita automáticamente, ya que se exige que el alumno se ponga al día antes de solicitar nuevas renovaciones.

### Trabajos Programados (Cron)
El backend ejecuta diariamente una función automatizada (`config/cron-tasks.ts`) que analiza todos los préstamos "Activos". Si la `returnDate` es menor a la fecha actual, el estado muta a `Overdue`. Este cambio de estado dispara automáticamente el *lifecycle hook* de Strapi que despacha el correo de alerta al estudiante correspondiente.

---

## 🔒 Permisos y Seguridad
Durante la puesta en producción, asegúrate de configurar correctamente los Roles y Permisos (`Roles & Permissions`) dentro del panel de Strapi:
- Permite la creación y visualización de préstamos para los usuarios autenticados.
- Habilita la ruta custom `/api/loans/:id/renew` para que los estudiantes puedan renovar sus préstamos de forma segura.

---
*Proyecto desarrollado a medida para la Biblioteca Dante Alighieri.* 🇮🇹📖
