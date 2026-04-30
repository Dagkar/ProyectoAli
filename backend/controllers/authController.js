import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const createAdminToken = () => {
  return 'admin-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

// Registro
export const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
      return res.json({ success: false, message: 'Campos requeridos faltantes' })
    }

    if (password.length < 6) {
      return res.json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.json({ success: false, message: 'Email ya registrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash
    })

    await nuevoUsuario.save()

    const token = createToken(nuevoUsuario._id)

    res.json({
      success: true,
      token,
      user: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.json({ success: false, message: error.message })
  }
}

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.json({ success: false, message: 'Email y contraseña requeridos' })
    }

    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.json({ success: false, message: 'Usuario no encontrado' })
    }

    const esValido = await bcrypt.compare(password, usuario.password)
    if (!esValido) {
      return res.json({ success: false, message: 'Contraseña incorrecta' })
    }

    const token = createToken(usuario._id)

    res.json({
      success: true,
      token,
      user: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.json({ success: false, message: error.message })
  }
}

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@atone.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (email === adminEmail && password === adminPassword) {
      const token = createAdminToken()
      return res.json({
        success: true,
        message: 'Login admin exitoso',
        token
      })
    }

    res.json({
      success: false,
      message: 'Credenciales inválidas'
    })
  } catch (error) {
    console.error('Error en admin login:', error)
    res.json({ success: false, message: error.message })
  }
}

// Perfil
export const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('-password')
    if (!usuario) {
      return res.json({ success: false, message: 'Usuario no encontrado' })
    }
    res.json({
      success: true,
      user: usuario
    })
  } catch (error) {
    console.error('Error en perfil:', error)
    res.json({ success: false, message: error.message })
  }
}

// Eliminar cuenta
export const eliminar = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.usuarioId)
    res.json({ success: true, message: 'Cuenta eliminada' })
  } catch (error) {
    console.error('Error al eliminar:', error)
    res.json({ success: false, message: error.message })
  }
}
