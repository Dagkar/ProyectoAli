import jwt from 'jsonwebtoken'

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1] || req.headers['token']

    if (!token) {
      return res.json({ success: false, message: 'Token no encontrado, inicia sesión' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuarioId = decoded.id
    next()
  } catch (error) {
    console.error('Error en verificarToken:', error)
    return res.json({ success: false, message: 'Token inválido o expirado' })
  }
}

// Middleware para admin
export const autenticar = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1]

    if (!token) {
      return res.json({ success: false, message: 'Token de admin requerido' })
    }

    // Validar que el token sea de admin (simple validación)
    if (!token.startsWith('admin-token-')) {
      return res.json({ success: false, message: 'Token inválido' })
    }

    req.adminToken = token
    next()
  } catch (error) {
    console.error('Error en autenticar:', error)
    return res.json({ success: false, message: 'No autorizado' })
  }
}

export default verificarToken
