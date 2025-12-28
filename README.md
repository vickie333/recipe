# 🍳 Recipe App Frontend

Una aplicación web moderna para gestionar recetas de cocina, construida con React, TypeScript y Vite.

## ✨ Características

- 🔐 **Autenticación de usuarios** - Sistema completo de login y registro
- 📝 **Gestión de recetas** - Crear, editar, ver y eliminar recetas
- 🏷️ **Tags e ingredientes** - Organiza tus recetas con etiquetas y gestiona ingredientes
- 👤 **Perfil de usuario** - Gestiona tu información personal
- 📱 **Diseño responsive** - Funciona perfectamente en móviles y escritorio
- 🎨 **UI moderna** - Interfaz construida con Tailwind CSS y componentes Radix UI

## 🚀 Tecnologías

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos

## 📋 Prerequisitos

- Node.js (versión 18 o superior)
- pnpm (recomendado) o npm

## 🛠️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd recipe-app-frontend
   ```

2. **Instala las dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env.local` basado en `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` y configura la URL de tu backend:
   ```env
   VITE_API_URL=https://tu-backend-url.com/api
   ```

## 🏃‍♂️ Uso

### Desarrollo

Inicia el servidor de desarrollo:
```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción

Genera el build optimizado:
```bash
pnpm build
# o
npm run build
```

### Preview del build

Previsualiza el build de producción localmente:
```bash
pnpm preview
# o
npm run preview
```

### Linting

Ejecuta el linter:
```bash
pnpm lint
# o
npm run lint
```

## 📁 Estructura del Proyecto

```
recipe-app-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/         # Imágenes y recursos
│   ├── core/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utilidades y configuraciones
│   │   ├── pages/      # Páginas de la aplicación
│   │   ├── routes/     # Configuración de rutas
│   │   ├── services/   # Servicios API
│   │   ├── types/      # Tipos TypeScript
│   │   └── utils/      # Funciones auxiliares
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Punto de entrada
├── index.html          # HTML principal
└── package.json        # Dependencias y scripts
```

## 🔑 Rutas Principales

- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/recipes` - Lista de recetas
- `/recipes/create` - Crear nueva receta
- `/recipes/:id` - Detalle de receta
- `/recipes/:id/edit` - Editar receta
- `/tags` - Gestión de etiquetas
- `/ingredients` - Gestión de ingredientes
- `/profile` - Perfil de usuario

## 🔒 Rutas Protegidas

Todas las rutas excepto `/login` y `/register` requieren autenticación. Los usuarios no autenticados serán redirigidos al login.

## 🌐 Despliegue

El proyecto está configurado para desplegarse en Vercel. El archivo `vercel.json` incluye la configuración necesaria para el enrutamiento SPA.


## 👥 Autor

María Victoria Pérez Contrera
