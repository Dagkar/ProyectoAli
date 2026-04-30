import express from 'express'
import {
  crearPedido,
  misPedidos,
  detallesPedido
} from '../controllers/pedidoController.js'
import verificarToken from '../middleware/auth.js'

const router = express.Router()

router.post('/', verificarToken, crearPedido)
router.get('/', verificarToken, misPedidos)
router.get('/:id', verificarToken, detallesPedido)

export default router
