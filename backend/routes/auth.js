import express from 'express'
import { registro, login, perfil, eliminar, adminLogin } from '../controllers/authController.js'
import { obtenerUsuarios, eliminarUsuario, cambiarContrasenaUsuario } from '../controllers/adminController.js'
import verificarToken, { autenticar } from '../middleware/auth.js'

const router = express.Router()

router.post('/registro', registro)
router.post('/login', login)
router.post('/admin-login', adminLogin)
router.get('/perfil', verificarToken, perfil)
router.delete('/eliminar', verificarToken, eliminar)

// Gestión de clientes desde el router de auth, que ya está validado en runtime
router.get('/admin-clientes', autenticar, obtenerUsuarios)
router.delete('/admin-clientes/:id', autenticar, eliminarUsuario)
router.put('/admin-clientes/:id/cambiar-password', autenticar, cambiarContrasenaUsuario)

export default router
