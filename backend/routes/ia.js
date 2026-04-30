import express from 'express'

const router = express.Router()

const servicios = [
  {
    id: 1,
    nombre: 'Starter Service',
    precio: 350,
    descripcion: 'Cambio de cuerdas, limpieza de fretboard y pulido de trastes.',
    categoria: 'servicios'
  },
  {
    id: 2,
    nombre: 'Tune-Up Service',
    precio: 500,
    descripcion: 'Ajuste de accion, entonacion y revision de electronica.',
    categoria: 'servicios'
  },
  {
    id: 3,
    nombre: 'Pro Service',
    precio: 650,
    descripcion: 'Mantenimiento completo con reparacion electronica basica.',
    categoria: 'servicios'
  },
  {
    id: 4,
    nombre: 'Acoustic Bliss Service',
    precio: 380,
    descripcion: 'Ajuste y mantenimiento enfocado en guitarra acustica.',
    categoria: 'servicios'
  }
]

// Obtener todos los servicios
router.get('/', (req, res) => {
  res.json(servicios)
})

// Obtener un servicio por ID
router.get('/:id', (req, res) => {
  const servicio = servicios.find(s => s.id === parseInt(req.params.id))
  if (!servicio) {
    return res.status(404).json({ error: 'Servicio no encontrado' })
  }
  res.json(servicio)
})

export default router