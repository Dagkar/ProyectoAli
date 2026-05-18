import { v2 as cloudinary } from 'cloudinary'
import { createSecretTokenInstance, uploadFile, createAsset } from '@landofassets/sdk'
import Producto from '../models/Producto.js'
import Usuario from '../models/Usuario.js'
import Pedido from '../models/Pedido.js'
import bcrypt from 'bcrypt'
import fs from 'fs/promises'

// Función para subir archivo 3D a Land of Assets
const subirModelo3D = async (filePath, fileName) => {
  try {
    console.log('=== Iniciando upload a Land of Assets ===')
    
    // Crear instancia del cliente con la API key secreta
    const client = createSecretTokenInstance({
      host: 'https://api.landofassets.com',
      secretToken: process.env.LAND_OF_ASSETS_SECRET_API_KEY
    })

    // Leer el archivo y convertir a Uint8Array para compatibilidad con el SDK
    const fileBuffer = await fs.readFile(filePath)
    const fileData = new Uint8Array(fileBuffer)
    console.log(`Archivo leído: ${fileName}, tamaño: ${fileData.length} bytes`)
    
    // Usar valores de configuración
    const orgName = process.env.LAND_OF_ASSETS_ORG_NAME
    const projectName = process.env.LAND_OF_ASSETS_PROJECT_NAME

    if (!orgName || !projectName) {
      throw new Error(`Configuración incompleta: orgName=${orgName}, projectName=${projectName}`)
    }

    console.log(`Configuración: Org=${orgName}, Project=${projectName}`)

    // Paso 1: Subir el archivo
    console.log('Subiendo archivo...')
    const uploadToken = await uploadFile(client, {
      params: { orgName, projectName },
      fileData,
      filename: fileName
    })
    
    console.log(`✓ Upload token obtenido`)

    // Paso 2: Crear el asset con el upload token
    console.log('Creando asset...')
    const rawAssetName = fileName.replace(/\.[^.]+$/, '')
    const normalizedAssetName = rawAssetName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const assetNameBase = /^[a-z]/.test(normalizedAssetName)
      ? normalizedAssetName
      : `model-${normalizedAssetName || 'file'}`
    const assetName = `${assetNameBase}-${Date.now()}`
    const asset = await createAsset(client, {
      params: { orgName, projectName },
      body: {
        name: assetName,
        type: 'MODEL',
        uploadToken: uploadToken,
        visibility: 'PUBLIC',
        shareLicense: 'CC_BY'
      }
    })
    
    console.log(`✓ Asset creado: ${asset.name}`)
    console.log(`✓ File OID: ${asset.fileOid}`)

    // Paso 3: Construir URL pública de media 3D para que el navegador reciba el modelo directamente
    const frontendKey = process.env.LAND_OF_ASSETS_API
    const fileUrl = `https://api.landofassets.com/media/${orgName}/${projectName}/${encodeURIComponent(asset.name)}/model/glb?frontendToken=${frontendKey}`
    
    console.log(`✓ URL del archivo generada: ${fileUrl}`)
    console.log('=== Upload completado exitosamente ===')
    
    return fileUrl
  } catch (error) {
    console.error('❌ Error al subir a Land of Assets:', error.message)
    console.error('Detalles:', error)
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

// Obtener todos los pedidos para administración
export const obtenerPedidosAdmin = async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 })

    res.json({
      success: true,
      pedidos
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}
