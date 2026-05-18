import express from 'express'
import { v2 as cloudinary } from 'cloudinary'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const archivo = req.files?.file

    if (!archivo) {
      return res.status(400).json({ success: false, message: 'Archivo no encontrado' })
    }

    const resultado = await cloudinary.uploader.upload(archivo.tempFilePath, {
      resource_type: 'image',
      folder: 'ali-personalizaciones'
    })

    return res.json({
      success: true,
      url: resultado.secure_url,
      public_id: resultado.public_id
    })
  } catch (error) {
    console.error('Error subiendo imagen:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
})

export default router