import express from 'express'
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController.js'

const router = express.Router()

router.get('/', obtenerProductos)
router.get('/:id', obtenerProducto)
router.post('/', crearProducto)
router.put('/:id', actualizarProducto)
router.delete('/:id', eliminarProducto)

export default router
