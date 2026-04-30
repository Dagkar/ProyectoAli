import { v2 as cloudinary } from 'cloudinary'
import { createSecretTokenInstance, uploadFile, createAsset, getFileUrl } from '@landofassets/sdk'
import Producto from '../models/Producto.js'
import Usuario from '../models/Usuario.js'
import bcrypt from 'bcrypt'
import fs from 'fs/promises'

// Función para subir archivo 3D a Land of Assets
const subirModelo3D = async (filePath, fileName) => {
  try {
    // Crear instancia del cliente con la API key secreta
    const client = createSecretTokenInstance({
      host: 'https://api.landofassets.com',
      secretToken: process.env.LAND_OF_ASSETS_SECRET_API_KEY
    })

    // Leer el archivo
    const fileData = await fs.readFile(filePath)
    
    // Usar valores por defecto para org y project
    const orgName = process.env.LAND_OF_ASSETS_ORG_NAME || 'default'
    const projectName = process.env.LAND_OF_ASSETS_PROJECT_NAME || 'productos'

    // Paso 1: Subir el archivo
    console.log('Subiendo archivo a Land of Assets...', { fileName, orgName, projectName })
    const uploadToken = await uploadFile(client, {
      params: { orgName, projectName },
      fileData,
      filename: fileName
    })
    console.log('Upload token obtenido:', uploadToken)

    // Paso 2: Crear el asset con el upload token
    console.log('Creando asset en Land of Assets...')
    const asset = await createAsset(client, {
      params: { orgName, projectName },
      body: {
        name: fileName.replace(/\.[^.]+$/, ''), // Nombre sin extensión
        type: 'MODEL', // Tipo de asset para modelos 3D
        uploadToken: uploadToken,
        visibility: 'PUBLIC', // Hacer público para acceso
        shareLicense: 'CC_BY' // Licencia de compartir
      }
    })
    console.log('Asset creado:', JSON.stringify(asset, null, 2))
    console.log('Asset fileOid:', asset.fileOid)

    // Validar que el fileOid sea válido
    if (!asset.fileOid) {
      throw new Error('El asset creado no tiene fileOid válido')
    }

    // Paso 3: Obtener URL pública del archivo
    console.log('Obteniendo URL pública del archivo...')
    const fileUrl = getFileUrl(client, {
      params: { oid: asset.fileOid },
      query: { name: fileName }
    })

    const finalUrl = fileUrl.toString()
    console.log('Archivo subido exitosamente:', finalUrl)
    return finalUrl
  } catch (error) {
    console.error('Error completo al subir a Land of Assets:', error)
    throw new Error(`Error subiendo modelo 3D: ${error.message}`)
  }
}

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

    // Procesar modelo 3D con Land of Assets (permite archivos .glb, .gltf, etc)
    if (req.files?.modelo3d) {
      const file = req.files.modelo3d
      
      // Validar que sea un archivo .glb o .gltf
      const extensionesValidas = ['.glb', '.gltf']
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      
      if (!extensionesValidas.includes(extension)) {
        return res.json({ 
          success: false, 
          message: 'Solo se aceptan archivos .glb o .gltf' 
        })
      }

      // Subir a Land of Assets
      modelo3dUrl = await subirModelo3D(file.tempFilePath, file.name)
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
