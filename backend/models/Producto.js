import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  caracteristicas: [{
    type: String,
    trim: true
  }],
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  imagen: {
    type: String,
    default: ''
  },
  imagenes: [{
    type: String
  }],
  modelo3d: {
    type: String,
    default: ''
  },
  categoria: {
    type: String,
    enum: ['pedales', 'accesorios', 'servicios'],
    default: 'pedales'
  },
  estiloDeSonido: {
    type: String,
    default: 'Distorsion'
  },
  tipoDeMusico: {
    type: String,
    enum: ['Principiante', 'Intermedio', 'Avanzado', 'Profesional'],
    default: 'Principiante'
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  destaque: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

// Indices para busqueda
productoSchema.index({ nombre: 'text', descripcion: 'text' })
productoSchema.index({ categoria: 1 })
productoSchema.index({ estiloDeSonido: 1 })
productoSchema.index({ tipoDeMusico: 1 })

const Producto = mongoose.model('Producto', productoSchema)
export default Producto
