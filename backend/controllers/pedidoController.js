import Pedido from '../models/Pedido.js'
import Producto from '../models/Producto.js'

// Crear pedido
export const crearPedido = async (req, res) => {
  try {
    const { items, usuario, total, metodo_pago, estado } = req.body

    if (!items || items.length === 0) {
      return res.json({ success: false, message: 'Carrito vacío' })
    }

    let totalCalculado = 0
    let itemsValidos = []

    // Validar productos y calcular total
    for (const item of items) {
      const producto = await Producto.findById(item.producto)

      if (!producto) {
        return res.json({ success: false, message: `Producto no existe` })
      }

      if (producto.stock < item.cantidad) {
        return res.json({
          success: false,
          message: `${producto.nombre} solo tiene ${producto.stock} en stock`
        })
      }

      totalCalculado += producto.precio * item.cantidad
      const itemSnapshot = {
        producto: item.producto,
        nombre: producto.nombre,
        imagen: producto.imagen,
        cantidad: item.cantidad,
        precio: item.precio
      }
      itemsValidos.push(itemSnapshot)

      // Reducir stock
      await Producto.findByIdAndUpdate(
        item.producto,
        { $inc: { stock: -item.cantidad } }
      )
    }

    const nuevoPedido = new Pedido({
      usuario: usuario,
      items: itemsValidos,
      total: totalCalculado || total,
      metodo_pago: metodo_pago || 'tarjeta',
      estado: estado || 'pendiente',
      usuarioId: req.usuarioId
    })

    await nuevoPedido.save()

    res.json({
      success: true,
      message: 'Pedido creado exitosamente',
      pedido: nuevoPedido
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Obtener mis pedidos
export const misPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuarioId: req.usuarioId })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      pedidos
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Obtener detalles de un pedido
export const detallesPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      _id: req.params.id,
      usuarioId: req.usuarioId
    })

    if (!pedido) {
      return res.json({ success: false, message: 'Pedido no encontrado' })
    }

    res.json({
      success: true,
      pedido
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
