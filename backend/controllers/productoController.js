import Producto from '../models/Producto.js'

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
    const { nombre, descripcion, precio, imagen, categoria, stock } = req.body

    if (!nombre || !precio || !imagen) {
      return res.json({ success: false, message: 'Campos requeridos faltantes' })
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      imagen,
      categoria,
      stock: stock || 0
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
