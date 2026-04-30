import { v2 as cloudinary } from 'cloudinary'
import Producto from '../models/Producto.js'
import Usuario from '../models/Usuario.js'
import bcrypt from 'bcrypt'

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      caracteristicas,
      'características': caracteristicasAccent,
      precio,
      categoria,
      estiloDeSonido,
      tipoDeMusico,
      destaque,
      stock
    } = req.body

    let imagen = ''
    let imagenes = []
    let modelo3dUrl = ''

    // Procesar imagen principal con Cloudinary
    if (req.files?.imagen) {
      const file = req.files.imagen
      const result = await cloudinary.uploader.upload(file.tempFilePath, { 
        resource_type: 'auto',
        folder: 'ali-productos/principales'
      })
      imagen = result.secure_url
    }

    // Procesar múltiples imágenes con Cloudinary
    if (req.files?.imagenes) {
      const files = Array.isArray(req.files.imagenes)
        ? req.files.imagenes
        : [req.files.imagenes]

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          resource_type: 'auto',
          folder: 'ali-productos/adicionales'
        })
        imagenes.push(result.secure_url)
      }
    }

    // Procesar modelo 3D con Cloudinary (permite archivos .glb, .gltf, etc)
    if (req.files?.modelo3d) {
      const file = req.files.modelo3d
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'raw',
        folder: 'ali-productos/modelos-3d'
      })
      modelo3dUrl = result.secure_url
    }

    const rawCaracteristicas = caracteristicas || caracteristicasAccent || ''
    const caracteristicasArray = typeof rawCaracteristicas === 'string'
      ? rawCaracteristicas.split(',').map(c => c.trim()).filter(c => c)
      : Array.isArray(rawCaracteristicas) ? rawCaracteristicas : []

    const producto = new Producto({
      nombre,
      descripcion,
      caracteristicas: caracteristicasArray,
      precio: Number(precio),
      imagen,
      imagenes,
      modelo3d: modelo3dUrl,
      categoria,
      estiloDeSonido: estiloDeSonido || 'Distorsion',
      tipoDeMusico: tipoDeMusico || 'Principiante',
      destaque: destaque === 'true' || destaque === true,
      stock: Number(stock) || 0
    })

    await producto.save()

    res.json({
      success: true,
      message: 'Producto creado exitosamente',
      producto
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const { categoria, estiloDeSonido, tipoDeMusico } = req.query

    let filter = {}
    if (categoria) filter.categoria = categoria
    if (estiloDeSonido) filter.estiloDeSonido = estiloDeSonido
    if (tipoDeMusico) filter.tipoDeMusico = tipoDeMusico

    const productos = await Producto.find(filter).sort({ createdAt: -1 })

    res.json({
      success: true,
      productos
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params
    const {
      nombre,
      descripcion,
      caracteristicas,
      'características': caracteristicasAccent,
      precio,
      categoria,
      estiloDeSonido,
      tipoDeMusico,
      destaque,
      stock
    } = req.body

    const producto = await Producto.findById(id)
    if (!producto) {
      return res.json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    // Actualizar campos básicos
    if (nombre) producto.nombre = nombre
    if (descripcion) producto.descripcion = descripcion
    const rawCaracteristicas = caracteristicas || caracteristicasAccent
    if (rawCaracteristicas) {
      producto.caracteristicas = typeof rawCaracteristicas === 'string'
        ? rawCaracteristicas.split(',').map(c => c.trim()).filter(c => c)
        : rawCaracteristicas
    }
    if (precio) producto.precio = Number(precio)
    if (categoria) producto.categoria = categoria
    if (estiloDeSonido) producto.estiloDeSonido = estiloDeSonido
    if (tipoDeMusico) producto.tipoDeMusico = tipoDeMusico
    if (destaque !== undefined) producto.destaque = destaque === 'true' || destaque === true
    if (stock !== undefined) producto.stock = Number(stock)

    // Procesar nueva imagen principal con Cloudinary
    if (req.files?.imagen) {
      const file = req.files.imagen
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'auto',
        folder: 'ali-productos/principales'
      })
      producto.imagen = result.secure_url
    }

    // Procesar nuevas imágenes con Cloudinary
    if (req.files?.imagenes) {
      const files = Array.isArray(req.files.imagenes)
        ? req.files.imagenes
        : [req.files.imagenes]

      producto.imagenes = []
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          resource_type: 'auto',
          folder: 'ali-productos/adicionales'
        })
        producto.imagenes.push(result.secure_url)
      }
    }

    // Procesar modelo 3D con Cloudinary
    if (req.files?.modelo3d) {
      const file = req.files.modelo3d
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'raw',
        folder: 'ali-productos/modelos-3d'
      })
      producto.modelo3d = result.secure_url
    }

    await producto.save()

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      producto
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params

    const producto = await Producto.findByIdAndDelete(id)
    if (!producto) {
      return res.json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// ====== GESTIÓN DE USUARIOS ======

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ rol: 'usuario' }).select('-password').sort({ createdAt: -1 })

    res.json({
      success: true,
      usuarios
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByIdAndDelete(id)
    if (!usuario) {
      return res.json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// Cambiar contraseña de usuario (por admin)
export const cambiarContrasenaUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { nuevaPassword } = req.body

    if (!nuevaPassword || nuevaPassword.length < 6) {
      return res.json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    const usuario = await Usuario.findById(id)
    if (!usuario) {
      return res.json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    const passwordHash = await bcrypt.hash(nuevaPassword, 10)
    usuario.password = passwordHash
    await usuario.save()

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}
