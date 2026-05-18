import express from 'express'
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController.js'
import { autenticar } from '../middleware/auth.js'

const router = express.Router()

router.get('/', obtenerProductos)
router.get('/:id', obtenerProducto)
router.post('/crear', autenticar, crearProducto)
router.put('/:id', autenticar, actualizarProducto)
router.delete('/:id', autenticar, eliminarProducto)

export default router
