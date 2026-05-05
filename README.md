# ATONE - Tienda Online de Pedales

ATONE es una plataforma web para vender pedales de guitarra, accesorios y servicios de audio. El proyecto está dividido en tres aplicaciones: frontend público, backend API y panel de administración, con soporte para catálogo, carrito, pedidos, gestión de productos y un asistente virtual.

## Resumen

- Catálogo de pedales, accesorios y servicios.
- Carrito, checkout e historial de pedidos.
- Registro, login y perfil de usuario.
- Panel de administración para productos y clientes.
- Subida de imágenes con Cloudinary.
- Soporte para modelos 3D con Land of Assets.
- Asistente virtual integrado con Botpress.

## Arquitectura

```text
PROYECTO ALI/
├── admin/      Panel de administración
├── backend/    API REST con Express y MongoDB
├── frontend/   Tienda pública con React
└── README.md
```

## Stack Tecnológico

**Frontend público:** React 18.3.1, Vite 5.4.1, React Router, Axios, React Toastify y Botpress Webchat.

**Backend:** Express.js, MongoDB + Mongoose, JWT, bcrypt, express-fileupload, Cloudinary y `@landofassets/sdk`.

**Admin:** React 18.3.1, Vite 5.4.1, React Router, Axios y React Toastify.

## Funcionalidades Principales

### Tienda pública

- Inicio, catálogo, detalle de producto y páginas informativas.
- Catálogo filtrable por categoría, estilo de sonido y tipo de músico.
- Carrito con control de stock.
- Flujo de pago y pedidos.
- Historial de compras del usuario.
- Botón y página de asistente virtual.

### Administración

- Creación, edición y eliminación de productos.
- Gestión de imágenes principales y secundarias.
- Carga de modelos 3D `.glb` y `.gltf`.
- Gestión de usuarios y cambio de contraseñas.
- Inicio de sesión de administrador.

## Asistente de IA

El asistente virtual se llama **A. Tone** y está integrado con **Botpress Webchat** en la ruta `/asistente`. Sirve como apoyo para resolver dudas sobre pedales, accesorios y servicios.

## Modelos de Datos

### Usuario

- nombre
- email
- password
- direccion
- telefono
- rol

### Producto

- nombre
- descripcion
- caracteristicas
- precio
- imagen
- imagenes
- modelo3d
- categoria
- estiloDeSonido
- tipoDeMusico
- stock
- destaque

### Pedido

- usuarioId
- usuario
- items
- total
- metodo_pago
- estado
- createdAt
- updatedAt

## Rutas de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/registro` | Crear una cuenta nueva de usuario. |
| POST | `/api/auth/login` | Iniciar sesión como usuario. |
| POST | `/api/auth/admin-login` | Iniciar sesión como administrador. |
| GET | `/api/auth/perfil` | Obtener el perfil del usuario autenticado. |
| DELETE | `/api/auth/eliminar` | Eliminar la cuenta del usuario autenticado. |
| GET | `/api/auth/admin-clientes` | Listar clientes desde el área de administración. |
| DELETE | `/api/auth/admin-clientes/:id` | Eliminar un cliente desde el área de administración. |
| PUT | `/api/auth/admin-clientes/:id/cambiar-password` | Cambiar la contraseña de un cliente desde el área de administración. |

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar productos con filtros disponibles. |
| GET | `/api/productos/:id` | Obtener el detalle de un producto. |
| POST | `/api/productos/crear` | Crear un producto nuevo. |
| PUT | `/api/productos/:id` | Actualizar un producto existente. |
| DELETE | `/api/productos/:id` | Eliminar un producto existente. |

### Pedidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/pedidos` | Crear un pedido nuevo. |
| GET | `/api/pedidos` | Obtener los pedidos del usuario autenticado. |
| GET | `/api/pedidos/:id` | Obtener el detalle de un pedido específico. |

### Administración

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/admin/producto/crear` | Crear un producto desde el panel de administración. |
| GET | `/api/admin/productos` | Listar productos desde el panel de administración. |
| PUT | `/api/admin/producto/:id` | Editar un producto desde el panel de administración. |
| DELETE | `/api/admin/producto/:id` | Eliminar un producto desde el panel de administración. |
| GET | `/api/admin/usuarios` | Listar usuarios desde el panel de administración. |
| DELETE | `/api/admin/usuario/:id` | Eliminar un usuario desde el panel de administración. |
| PUT | `/api/admin/usuario/:id/cambiar-password` | Cambiar la contraseña de un usuario desde el panel de administración. |

## Instalación Local

### Requisitos

- Node.js 18 o superior
- npm
- MongoDB Atlas o MongoDB local

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Admin

```bash
cd admin
npm install
npm run dev
```

## Deploy

- El proyecto está preparado para desplegarse con Vercel.

## Scripts Útiles

**Backend**

- `npm run dev`
- `npm start`

**Frontend y admin**

- `npm run dev`
- `npm run build`
- `npm run preview`

## Soporte

Para dudas o problemas, revisa primero que el backend esté en ejecución antes de levantar el frontend y el admin.

## Licencia

Proyecto propietario de ATONE.

**Última actualización:** Mayo 2026
