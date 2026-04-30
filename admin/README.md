# ATONE Admin Panel

Panel de administración separado para ATONE, deployable independientemente en Vercel.

## 🚀 Instalación

```bash
npm install
```

## 📝 Desarrollo

```bash
npm run dev
```

Accede a `http://localhost:5175/` (o al puerto que Vite asigne)

## 🔑 Credenciales

- Email: `admin@atone.com`
- Contraseña: `admin123`

## 🔗 Configuración API

El admin por defecto se conecta a:
```
http://localhost:3000/api/
```

Proxy configurado en `vite.config.js`

## 📦 Build

```bash
npm run build
```

Genera carpeta `dist/` lista para Vercel.

## 🌐 Deploy en Vercel

1. Conecta solo la carpeta `admin/` a Vercel
2. Configura la variable de entorno si es necesario:
   - `VITE_API_URL` (opcional)

```bash
vercel
```

## 📂 Estructura

```
admin/
├── src/
│   ├── admin/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── styles/
│       └── admin.css
├── index.html
├── vite.config.js
├── package.json
└── vercel.json
```

## ℹ️ Notas

- Esta carpeta es completamente independiente
- Se puede deployar sin el frontend o backend
- El backend debe estar disponible en la URL configurada
- Para desarrollo local, asegúrate de que el backend corre en puerto 3000
