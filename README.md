# ATONE - Tienda Online de Pedales

Aplicación web moderna para vender pedales de guitarra, accesorios y servicios de audio. Construida con React, Node.js/Express y MongoDB.

## 🏗️ Arquitectura

```
PROYECTO ALI/
├── admin/             ← Panel de administración (React + Vite)
├── backend/           ← API REST (Express + MongoDB)
├── frontend/          ← Tienda online (React + Vite)
├── .gitignore
├── README.md
└── vercel.json        ← Configuración de deploy
```

## 🚀 Stack Tecnológico

**Frontend:**
- React 18.3.1
- Vite 5.4.1
- React Router v6
- Axios para llamadas HTTP
- React Toastify para notificaciones

**Backend:**
- Express.js
- MongoDB + Mongoose
- JWT para autenticación
- Bcrypt para hash de contraseñas
- Express-fileupload para gestión de archivos

**Admin:**
- React 18.3.1
- Vite 5.4.1
- TailwindCSS

## 📋 Requisitos

- **Node.js** v18+
- **npm** o **yarn**
- **MongoDB Atlas** (base de datos en la nube)
- **Git**

---

## 🔧 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/proyecto-ali.git
cd proyecto-ali
```

### 2. Instalar dependencias

**Todo a la vez:**
```bash
npm run install:all
```

**O por partes:**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

Admin:
```bash
cd admin
npm install
```

### 3. Configurar variables de entorno

**Backend** (`backend/.env`):
```
MONGODB_URI=mongodb://localhost:27017/proyecto-ali
JWT_SECRET=tu_clave_secreta_local_2024
PORT=3000
NODE_ENV=development
```

**Frontend** (`frontend/.env` - opcional):
```
VITE_API_URL=http://localhost:3000
```

---

## Ejecutar en Localhost

### Opción A: Dos terminales (recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Escuchará en http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Escuchará en http://localhost:5173 o en el siguiente puerto libre
```

Luego abre la URL que te muestre la terminal.

### Opción B: Una terminal (ejecutar ambos en background)

```bash
npm run dev:all
```

---

## Estructura de Carpetas

### Frontend

```
frontend/
├── src/
│   ├── components/       ← Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductItem.jsx
│   │   ├── CartTotal.jsx
│   │   └── SearchBar.jsx
│   ├── pages/           ← Páginas (rutas)
│   │   ├── Home.jsx
│   │   ├── Catalogo.jsx
│   │   ├── Carrito.jsx
│   │   └── Login.jsx
│   ├── context/         ← Estado global
│   │   └── ShopContext.jsx
│   ├── styles/          ← CSS por componente
│   ├── App.jsx          ← Aplicación principal
│   ├── main.jsx         ← Punto de entrada
│   └── index.css        ← Estilos globales
├── vite.config.js
├── package.json
└── vercel.json
```

### Backend

```
backend/
├── config/
│   └── mongodb.js       ← Conexión a MongoDB
├── controllers/         ← Lógica de negocios
│   ├── authController.js
│   ├── productoController.js
│   └── pedidoController.js
├── models/             ← Esquemas de MongoDB
│   ├── Usuario.js
│   ├── Producto.js
│   └── Pedido.js
├── routes/             ← Rutas de API
│   ├── auth.js
│   ├── productos.js
│   ├── pedidos.js
│   └── ia.js
├── middleware/         ← Funciones intermedias
│   └── auth.js         ← Verificación de JWT
├── server.js           ← Servidor principal
├── package.json
└── vercel.json
```

---

## API Endpoints

### Autenticación

| Método | Endpoint           | Descripción                |
|--------|-------------------|----------------------------|
| POST   | `/api/auth/registro` | Crear nueva cuenta         |
| POST   | `/api/auth/login`    | Iniciar sesión             |
| GET    | `/api/auth/perfil`   | Obtener perfil (requiere token) |
| DELETE | `/api/auth/eliminar` | Eliminar cuenta (requiere token) |

### Productos

| Método | Endpoint           | Descripción                |
|--------|-------------------|----------------------------|
| GET    | `/api/productos`     | Listar todos               |
| GET    | `/api/productos/:id` | Obtener uno por ID         |
| POST   | `/api/productos`     | Crear (admin)              |
| PUT    | `/api/productos/:id` | Actualizar (admin)         |
| DELETE | `/api/productos/:id` | Eliminar (admin)           |

### Pedidos

| Método | Endpoint           | Descripción                |
|--------|-------------------|----------------------------|
| POST   | `/api/pedidos`       | Crear pedido (requiere token) |
| GET    | `/api/pedidos`       | Obtener mis pedidos (requiere token) |
| GET    | `/api/pedidos/:id`   | Obtener detalles (requiere token) |

---

## Deploy en Vercel

### 1. Conectar GitHub

```bash
git add .
git commit -m "Estructura inicial con React y MongoDB"
git push origin main
```

### 2. Crear proyecto en Vercel

- Ve a [vercel.com](https://vercel.com)
- Haz clic en "New Project"
- Selecciona tu repositorio de GitHub
- Vercel detectará automáticamente la estructura

### 3. Configurar variables de entorno

En el dashboard de Vercel, ve a **Settings** > **Environment Variables** y agrega:

```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/proyecto-ali
JWT_SECRET=tu_clave_secreta_produccion_2024
```

### 4. Deploy

- El deployment ocurre automáticamente cuando haces push a `main`
- Vercel compilará el frontend y ejecutará el backend
- Tu sitio estará en: `https://tu-proyecto.vercel.app`

---

## Scripts Útiles

### Frontend

```bash
npm run dev      # Ejecutar en desarrollo
npm run build    # Construir para producción
npm run preview  # Ver preview de producción
```

### Backend

```bash
npm run dev      # Ejecutar con nodemon (recarga automática)
npm start        # Ejecutar en producción
```

---

## Troubleshooting

### Error: "Cannot find module 'mongodb'"

```bash
cd backend
npm install mongoose
```

### Error: "MONGODB_URI is not defined"

Asegúrate de que `.env` existe en `backend/` con:
```
MONGODB_URI=mongodb://localhost:27017/proyecto-ali
```

### El frontend no se conecta al backend

Verifica que:
1. Backend está corriendo en puerto 3000
2. Frontend está corriendo en puerto 5173
3. En `frontend/vite.config.js`, el proxy apunta a `http://localhost:3000`

---

## Próximos Pasos

- [x] Gestión de clientes en admin
- [x] Sistema de carrito de compras
- [x] Página de checkout y pagos
- [x] Historial de compras
- [ ] Implementar pasarela de pagos (Stripe/Razorpay)
- [ ] Agregar sistema de reseñas
- [ ] Sistema de cupones/descuentos
- [ ] Notificaciones por email

---

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo o abre un issue en GitHub.

---

## 📄 Licencia

Este proyecto es propietario de ATONE. Todos los derechos reservados.
- [ ] Integrar Cloudinary para imágenes
- [ ] Tests automatizados

---

## Licencia

MIT - Siéntete libre de usar este proyecto

## Contacto

Para preguntas o sugerencias, contacta a [tu-email@example.com](mailto:tu-email@example.com)

---

**Última actualización:** Abril 2026
