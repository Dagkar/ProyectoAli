import mongoose from 'mongoose'

const pedidoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  usuario: {
    nombre: String,
    email: String,
    telefono: String,
    direccion: String
  },
  items: [{
    itemId: {
      type: String,
      default: ''
    },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    },
    esPersonalizado: {
      type: Boolean,
      default: false
    },
    nombre: {
      type: String,
      default: ''
    },
    imagen: {
      type: String,
      default: ''
    },
    cantidad: {
      type: Number,
      required: true
    },
    precio: {
      type: Number,
      required: true
    },
    personalizacion: {
      tipoPedal: {
        type: String,
        default: ''
      },
      estiloSonido: [{
        type: String
      }],
      referenciaSonido: {
        type: String,
        default: ''
      },
      enclosureColor: {
        type: String,
        default: ''
      },
      knobColor: {
        type: String,
        default: ''
      },
      ledColor: {
        type: String,
        default: ''
      },
      nombrePedal: {
        type: String,
        default: ''
      },
      complejidad: {
        type: String,
        default: ''
      },
      controles: [{
        type: String
      }],
      usoPrincipal: [{
        type: String
      }],
      descripcionUso: {
        type: String,
        default: ''
      },
      referenciaArchivo: {
        type: String,
        default: ''
      }
    }
  }],
  total: {
    type: Number,
    required: true
  },
  metodo_pago: {
    type: String,
    enum: ['tarjeta', 'transferencia', 'efectivo'],
    default: 'tarjeta'
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'confirmado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const Pedido = mongoose.model('Pedido', pedidoSchema)
export default Pedido
