import Producto from '../models/Producto.js'
import { createSecretTokenInstance, uploadFile, createAsset } from '@landofassets/sdk'
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

    // Leer el archivo
    const fileData = await fs.readFile(filePath)
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
    const assetName = fileName.replace(/\.[^.]+$/, '') // Nombre sin extensión
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

    // Paso 3: Construir URL pública usando el fileOid y FRONTEND API KEY
    const frontendKey = process.env.LAND_OF_ASSETS_API
    const fileUrl = `https://api.landofassets.com/files/${asset.fileOid}?frontendToken=${frontendKey}`
    
    console.log(`✓ URL del archivo generada: ${fileUrl}`)
    console.log('=== Upload completado exitosamente ===')
    
    return fileUrl
  } catch (error) {
    console.error('❌ Error al subir a Land of Assets:', error.message)
    console.error('Detalles:', error)
    throw new Error(`Error subiendo modelo 3D: ${error.message}`)
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
    console.error('Error al obtener productos:', error)
    res.json({ success: false, message: error.message })
  }
}

// Obtener producto por ID
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
    if (!producto) {
      return res.json({ success: false, message: 'Producto no encontrado' })
    }
    res.json({
      success: true,
      producto
    })
  } catch (error) {
    console.error('Error al obtener producto:', error)
    res.json({ success: false, message: error.message })
  }
}

// Crear producto (admin)
export const crearProducto = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      caracteristicas, 
      precio, 
      categoria, 
      stock, 
      estiloDeSonido,
      tipoDeMusico,
      destaque
    } = req.body

    // Validar campos requeridos
    if (!nombre || !precio) {
      return res.json({ success: false, message: 'Nombre y precio son requeridos' })
    }

    // Procesar imagen principal
    let imagenUrl = ''
    if (req.files && req.files.imagen) {
      const imagen = req.files.imagen
      // Aquí puedes implementar subida a Cloudinary si lo deseas
      // Por ahora, guardamos el nombre del archivo
      imagenUrl = imagen.name
    }

    // Procesar múltiples imágenes
    let imagenesUrls = []
    if (req.files && req.files.imagenes) {
      const imagenes = Array.isArray(req.files.imagenes) 
        ? req.files.imagenes 
        : [req.files.imagenes]
      imagenesUrls = imagenes.map(img => img.name)
    }

    // Procesar modelo 3D si existe
    let modelo3dUrl = ''
    if (req.files && req.files.modelo3d) {
      const modelo3d = req.files.modelo3d
      
      // Validar que sea un archivo .glb o .gltf
      const extensionesValidas = ['.glb', '.gltf']
      const extension = modelo3d.name.substring(modelo3d.name.lastIndexOf('.')).toLowerCase()
      
      if (!extensionesValidas.includes(extension)) {
        return res.json({ 
          success: false, 
          message: 'Solo se aceptan archivos .glb o .gltf' 
        })
      }

      // Subir a Land of Assets
      modelo3dUrl = await subirModelo3D(modelo3d.tempFilePath, modelo3d.name)
    }

    // Procesar características
    let caracteristicasArray = []
    if (caracteristicas) {
      try {
        caracteristicasArray = JSON.parse(caracteristicas)
      } catch (e) {
        caracteristicasArray = []
      }
    }

    // Crear nuevo producto
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      caracteristicas: caracteristicasArray,
      precio,
      imagen: imagenUrl,
      imagenes: imagenesUrls,
      modelo3d: modelo3dUrl,
      categoria,
      stock: stock || 0,
      estiloDeSonido,
      tipoDeMusico,
      destaque: destaque === 'true' || destaque === true
    })

    await nuevoProducto.save()

    res.json({
      success: true,
      producto: nuevoProducto,
      message: 'Producto creado exitosamente'
    })
  } catch (error) {
    console.error('Error al crear producto:', error)
    res.json({ success: false, message: error.message })
  }
}

// Actualizar producto (admin)
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!producto) {
      return res.json({ success: false, message: 'Producto no encontrado' })
    }
    res.json({
      success: true,
      producto,
      message: 'Producto actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.json({ success: false, message: error.message })
  }
}

// Eliminar producto (admin)
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id)
    if (!producto) {
      return res.json({ success: false, message: 'Producto no encontrado' })
    }
    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    res.json({ success: false, message: error.message })
  }
}
