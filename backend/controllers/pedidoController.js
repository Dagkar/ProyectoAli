import Pedido from '../models/Pedido.js'
import Producto from '../models/Producto.js'
import { v2 as cloudinary } from 'cloudinary'

const typePriceMap = {
  Boost: 1050,
  Fuzz: 1300,
  Overdrive: 1550,
  Distortion: 1650,
  Tremolo: 1900,
  Chorus: 2700,
  Delay: 2900,
  Reverb: 3500,
  'Pedal experimental / noise': 3000,
  'No estoy seguro, quiero asesoría': 0
}

const complexityPriceMap = {
  simple: 0,
  intermedio: 500,
  completo: 1200,
  asesoria: 0
}

const usePriceMap = {
  'Para tocar en casa': 0,
  'Para grabación en estudio': 120,
  'Para tocar en vivo': 180,
  'Para pedalboard principal': 150,
  'Para bajo': 150,
  'Para guitarra': 0,
  'Para sonidos experimentales': 250,
  Otro: 120
}

const controlPriceMap = {
  Bass: 175,
  Treble: 175,
  Bias: 225,
  Blend: 350,
  Mix: 350,
  Feedback: 400,
  Depth: 250,
  Rate: 250,
  Shape: 275,
  'Pre-delay': 500,
  'Tap tempo': 850,
  'Clean Blend': 350,
  Gate: 175,
  Modulation: 175,
  Time: 0,
  Volume: 0,
  Gain: 0,
  Tone: 0,
  Fuzz: 0,
  Level: 0
}

const calculatePersonalizationPrice = (data = {}) => {
  const tipoPedal = data.tipoPedal || ''
  const estiloSonido = Array.isArray(data.estiloSonido) ? data.estiloSonido : []
  const controles = Array.isArray(data.controles) ? data.controles : []
  const usoPrincipal = Array.isArray(data.usoPrincipalSeleccion) && data.usoPrincipalSeleccion.length > 0
    ? data.usoPrincipalSeleccion
    : Array.isArray(data.usoPrincipal)
      ? data.usoPrincipal
      : []

  const enclosureColor = data.enclosureColorSeleccion || data.enclosureColor || ''
  const knobColor = data.knobColorSeleccion || data.knobColor || ''
  const ledColor = data.ledColorSeleccion || data.ledColor || ''

  const tipoExtra = typePriceMap[tipoPedal] || 0
  const sonidoExtra = estiloSonido.reduce((sum, option) => {
    if (option === 'Psicodélico') return sum + 300
    if (option === 'Transparente') return sum + 200
    if (option === 'Experimental') return sum + 600
    if (option === 'Inspirado en un artista') return sum + 550
    return sum
  }, 0)
  const complejidadExtra = complexityPriceMap[data.complejidad] || 0
  const controlesExtra = controles.reduce((sum, control) => sum + (controlPriceMap[control] || 125), 0)
  const enclosureExtra = enclosureColor && ['Negro', 'Blanco', 'Plateado', 'Sin pintar / aluminio'].includes(enclosureColor) ? 0 : (enclosureColor ? 250 : 0)
  const knobExtra = knobColor && ['Negro', 'Blanco', 'Crema'].includes(knobColor) ? 0 : (knobColor ? 120 : 0)
  const ledExtra = ledColor && ['Rojo', 'Azul', 'Verde', 'Blanco', 'Amarillo'].includes(ledColor) ? 0 : (ledColor ? 75 : 0)
  const usoExtra = usoPrincipal.reduce((sum, option) => sum + (usePriceMap[option] ?? 120), 0)

  return tipoExtra + sonidoExtra + complejidadExtra + controlesExtra + enclosureExtra + knobExtra + ledExtra + usoExtra
}

const subirReferenciaVisual = async (referenciaArchivo) => {
  if (!referenciaArchivo || typeof referenciaArchivo !== 'string') return ''
  if (!referenciaArchivo.startsWith('data:image/')) return referenciaArchivo

  const result = await cloudinary.uploader.upload(referenciaArchivo, {
    resource_type: 'image',
    folder: 'ali-personalizaciones'
  })

  return result.secure_url || referenciaArchivo
}

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
      const esPersonalizado = Boolean(
        item.esPersonalizado ||
        item.personalizacion ||
        (typeof item.itemId === 'string' && item.itemId.startsWith('custom_')) ||
        (typeof item.producto === 'string' && item.producto.startsWith('custom_'))
      )

      if (esPersonalizado) {
        const personalizacion = item.personalizacion || {}
        const precioPersonalizado = calculatePersonalizationPrice(personalizacion)
        const referenciaArchivo = await subirReferenciaVisual(personalizacion.referenciaArchivo || '')
        totalCalculado += precioPersonalizado * item.cantidad

        itemsValidos.push({
          itemId: item.itemId || item.id || '',
          esPersonalizado: true,
          nombre: item.nombre || personalizacion.nombrePedal || 'Pedido personalizado',
          imagen: item.imagen || '',
          cantidad: item.cantidad,
          precio: precioPersonalizado,
          personalizacion: {
            ...personalizacion,
            referenciaArchivo
          }
        })

        continue
      }

      const productoId = item.producto || item._id || item.itemId
      if (!productoId) {
        console.warn('Item sin producto ID:', item)
        return res.json({ success: false, message: 'Item inv?lido: falta producto ID' })
      }

      const producto = await Producto.findById(productoId)

      if (producto) {
        if (producto.stock < item.cantidad) {
          return res.json({
            success: false,
            message: `${producto.nombre} solo tiene ${producto.stock} en stock`
          })
        }

        totalCalculado += producto.precio * item.cantidad
        itemsValidos.push({
          itemId: productoId,
          producto: productoId,
          esPersonalizado: false,
          nombre: producto.nombre,
          imagen: producto.imagen,
          cantidad: item.cantidad,
          precio: producto.precio
        })

        // Reducir stock
        await Producto.findByIdAndUpdate(
          productoId,
          { $inc: { stock: -item.cantidad } }
        )
      } else {
        console.warn(`Producto con ID ${productoId} no encontrado; se guardar? el snapshot enviado por el cliente`)
        const precioSnapshot = Number(item.precio) || 0
        totalCalculado += precioSnapshot * item.cantidad
        itemsValidos.push({
          itemId: productoId,
          producto: productoId,
          esPersonalizado: false,
          nombre: item.nombre || 'Producto eliminado',
          imagen: item.imagen || '',
          cantidad: item.cantidad,
          precio: precioSnapshot
        })
      }

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

// Obtener pedidos para administración
export const obtenerPedidosAdmin = async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 })

    res.json({
      success: true,
      pedidos
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Actualizar estado de un pedido (ruta admin)
export const actualizarEstadoPedidoAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    const estadosPermitidos = ['pendiente', 'pagado', 'confirmado', 'enviado', 'entregado', 'cancelado']
    if (!estadosPermitidos.includes(estado)) return res.json({ success: false, message: 'Estado inválido' })

    const pedido = await Pedido.findById(id)
    if (!pedido) return res.json({ success: false, message: 'Pedido no encontrado' })

    const tienePersonal = Boolean(pedido.items && pedido.items.some(i => i.esPersonalizado || (i.personalizacion && Object.keys(i.personalizacion).length > 0)))

    if (tienePersonal) {
      // Para pedidos con personalización solo permitir pendiente <-> pagado
      if (!['pendiente', 'pagado'].includes(estado)) {
        return res.json({ success: false, message: 'Para pedidos con personalización sólo se permite cambiar entre pendiente y pagado' })
      }
    }

    pedido.estado = estado
    await pedido.save()

    res.json({ success: true, pedido })
  } catch (error) {
    console.error(error)
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
