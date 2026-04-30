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
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
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
    enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
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
