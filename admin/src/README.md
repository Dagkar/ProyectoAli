# ATONE Admin Panel

Panel de administración para la tienda de ATONE.

## Acceso

**URL:** `http://localhost:5174/admin` (cuando esté en desarrollo con Vite)

### Credenciales por defecto:
- **Email:** admin@atone.com
- **Contraseña:** admin123

> Puedes cambiar estas credenciales usando variables de entorno: `ADMIN_EMAIL` y `ADMIN_PASSWORD`

## Funcionalidades

### 1. Agregar Producto
- **Nombre:** Nombre del producto (requerido)
- **Descripción:** Descripción detallada (requerido)
- **Características:** Agregar múltiples características dinámicamente
- **Precio:** Precio del producto (requerido)
- **Imagen Principal:** Portada del producto
- **Imágenes Adicionales:** Galería de múltiples imágenes
- **Categoría:** Pedales, Accesorios o Servicios
- **Estilo de Sonido:** Distorsión, Delay, Reverb, Modulación, Pitch, Dinámico, Ambience, Otro
- **Nivel de Músico:** Principiante, Intermedio, Avanzado, Profesional
- **Modelo 3D:** (Solo para pedales) Archivo GLB o GLTF
- **Destaque:** Marcar para mostrar en página principal

### 2. Listar Productos
- Filtrar por categoría (Pedales, Accesorios, Servicios)
- Ver información resumida en tabla
- Editar o eliminar productos
- Búsqueda rápida

### 3. Editar Producto
- Modificar todos los campos del producto
- Actualizar imágenes
- Cambiar características
- Actualizar modelo 3D

## Estructura de Carpetas

```
frontend/src/admin/
├── components/
│   ├── Login.jsx      # Pantalla de login
│   ├── Navbar.jsx     # Barra de navegación
│   └── Sidebar.jsx    # Menú lateral
├── pages/
│   ├── Add.jsx        # Agregar producto
│   ├── List.jsx       # Listar productos
│   └── Edit.jsx       # Editar producto
├── App.jsx            # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos
```

## API Endpoints (Backend)

### Admin - Productos

- `POST /api/admin/producto/crear` - Crear nuevo producto
- `GET /api/admin/productos` - Obtener todos los productos (con filtros opcionales)
- `PUT /api/admin/producto/:id` - Actualizar producto
- `DELETE /api/admin/producto/:id` - Eliminar producto

**Parámetros de Consulta (Query Params):**
- `categoria` - Filtrar por categoría (pedales, accesorios, servicios)
- `estiloDeSonido` - Filtrar por estilo de sonido
- `tipoDeMusico` - Filtrar por nivel de músico

**Headers Requeridos:**
```
x-access-token: admin-token-xxx
```

## Desarrollo

### Para ejecutar el panel de admin:

1. **Terminal 1 - Backend:**
```bash
cd backend
npm start
# Puerto 5000
```

2. **Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Puerto 5174 para la tienda
# El admin estará disponible en localhost:5174/admin
```

### Build para Producción:

```bash
cd frontend
npm run build
# Genera tanto main.js como admin.js
```

## Estructura de Datos - Producto

```javascript
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  características: [String],
  precio: Number,
  imagen: String,          // URL de imagen principal
  imagenes: [String],      // URLs de imágenes adicionales
  modelo3d: String,        // URL de modelo 3D (GLB/GLTF)
  categoria: String,       // pedales | accesorios | servicios
  estiloDeSonido: String,  // Distorsión | Delay | Reverb | etc
  tipoDeMusico: String,    // Principiante | Intermedio | Avanzado | Profesional
  destaque: Boolean,       // Mostrar en página principal
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Notas Importantes

- Los archivos subidos se guardan en `/backend/uploads/`
- Las imágenes son accesibles en `/uploads/nombre-archivo` después de subirse
- El servidor debe estar corriendo en puerto 5000 para que funcione el proxy
- Los tokens de admin se generan con formato `admin-token-{timestamp}-{random}`
- Se valida que el token comience con `admin-token-` en el middleware

## Troubleshooting

### "Token de admin requerido"
- Verifica que estés enviando el header `x-access-token`
- Asegúrate de que el login fue exitoso

### "Modelo no encontrado al editar"
- Verifica que el ID del producto sea válido
- Intenta recargar la página y seleccionar de nuevo

### Los archivos no se guardan
- Verifica que la carpeta `backend/uploads/` existe
- Comprueba los permisos de escritura en la carpeta
- Revisa la consola del backend para errores

## Próximas Mejoras

- [ ] Validación de email/contraseña más segura (JWT para admin)
- [ ] Gestión de múltiples usuarios administradores
- [ ] Historial de cambios
- [ ] Backup automático de base de datos
- [ ] Caché de imágenes optimizadas
- [ ] Compresión automática de imágenes
- [ ] Visualización previa de modelo 3D en admin
