import express from 'express'
import {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto,
  obtenerUsuarios,
  eliminarUsuario,
  cambiarContrasenaUsuario,
  obtenerPedidosAdmin
} from '../controllers/adminController.js'
import { actualizarEstadoPedidoAdmin } from '../controllers/pedidoController.js'
import { autenticar } from '../middleware/auth.js'

const router = express.Router()

// Rutas de admin para productos
router.post('/producto/crear', autenticar, crearProducto)
router.get('/productos', autenticar, obtenerProductos)
router.put('/producto/:id', autenticar, actualizarProducto)
router.delete('/producto/:id', autenticar, eliminarProducto)

// Rutas de admin para usuarios
router.get('/usuarios', autenticar, obtenerUsuarios)
router.delete('/usuario/:id', autenticar, eliminarUsuario)
router.put('/usuario/:id/cambiar-password', autenticar, cambiarContrasenaUsuario)

// Rutas de admin para pedidos
router.get('/pedidos', autenticar, obtenerPedidosAdmin)
router.put('/pedidos/:id/estado', autenticar, actualizarEstadoPedidoAdmin)

export default router
