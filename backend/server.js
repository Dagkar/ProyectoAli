import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import os from 'os'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import authRoutes from './routes/auth.js'
import productosRoutes from './routes/productos.js'
import pedidosRoutes from './routes/pedidos.js'
import uploadsRoutes from './routes/uploads.js'
import adminRoutes from './routes/admin.js'
import {
  obtenerUsuarios,
  eliminarUsuario,
  cambiarContrasenaUsuario
} from './controllers/adminController.js'
import { autenticar } from './middleware/auth.js'

// App Config
const app = express()
const port = process.env.PORT || 3000

// Conectar MongoDB
connectDB()

// Conectar Cloudinary
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Configure express-fileupload to use temp files so Cloudinary can read uploaded file paths
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
  createParentPath: true
}))
app.use(cors())

// Servir archivos est�ticos
app.use('/uploads', express.static('uploads'))

// API endpoints
app.use('/api/auth', authRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/uploads', uploadsRoutes)
app.use('/api/pedidos', pedidosRoutes)
app.use('/api/admin', adminRoutes)

// Fallback directo para gestión de clientes
app.get('/api/admin/clientes', autenticar, obtenerUsuarios)
app.delete('/api/admin/clientes/:id', autenticar, eliminarUsuario)
app.put('/api/admin/clientes/:id/cambiar-password', autenticar, cambiarContrasenaUsuario)

// Health check
app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))


