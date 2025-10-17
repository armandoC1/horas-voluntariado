🕊️ Registro de Voluntariado — Dirección de Integración

Registro de Voluntariado es una aplicación web desarrollada con Next.js (Frontend + Backend) que permite registrar, visualizar y gestionar las horas de voluntariado realizadas por los estudiantes o miembros de la Dirección de Integración.

El sistema ofrece autenticación de usuarios, registro de actividades, estadísticas por ciclos y exportación de datos a CSV/Excel, todo dentro de una interfaz moderna y responsiva.

🚀 Características Principales

✅ Autenticación segura: registro e inicio de sesión con validación.
✅ Gestión de actividades: registro de nombre, fecha, hora, lugar y ciclo.
✅ Cálculo automático de horas: el sistema calcula horas basadas en entrada y salida.
✅ Visualización de progreso: gráficas interactivas por ciclo y tendencia mensual.
✅ Estadísticas en tiempo real: total de horas, promedio por actividad, y ciclos acumulados.
✅ Exportación de datos: descarga de actividades en formato CSV o Excel.
✅ Diseño adaptable: interfaz moderna optimizada para escritorio y móvil.

🧩 Tecnologías Utilizadas

Next.js 14+ — Framework React Full Stack

TypeScript — Tipado y mantenibilidad

Tailwind CSS — Diseño rápido y moderno


PostgreSQL  — Base de datos

Recharts — Gráficas de progreso

NextAuth.js — Autenticación de usuarios


📸 Vistas del Sistema
Pantalla	Descripción
🟣 Inicio de sesión / Registro	Permite crear cuenta o acceder con credenciales existentes.
🟣 Dashboard	Muestra resumen de horas, ciclos y promedios.
🟣 Registro de actividad	Formulario para agregar nuevas actividades con hora, lugar y ciclo.
🟣 Gráficas	Visualiza el progreso de horas completadas y tendencias mensuales.
🟣 Listado de actividades	Tabla editable con opción de eliminar y exportar datos.
⚙️ Instalación y Uso Local
# 1️⃣ Clonar el repositorio
git clone https://github.com/tuusuario/registro-voluntariado.git
cd registro-voluntariado

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Configurar variables de entorno
cp .env.example .env.local
# Edita la conexión de base de datos y credenciales

# 4️⃣ Ejecutar el entorno de desarrollo
npm run dev

# 5️⃣ Abrir en el navegador
http://localhost:3000