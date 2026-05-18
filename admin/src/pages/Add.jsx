import React, { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [características, setCaracterísticas] = useState([])
  const [característicaInput, setCaracterísticaInput] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('pedales')
  const [estiloDeSonido, setEstiloDeSonido] = useState('Otro')
  const [tipoDeMusico, setTipoDeMusico] = useState('Principiante')
  const [imagen, setImagen] = useState(null)
  const [imagenes, setImagenes] = useState([])
  const [modelo3d, setModelo3d] = useState(null)
  const [destaque, setDestaque] = useState(false)
  const [stock, setStock] = useState(0)
  const [loading, setLoading] = useState(false)

  const agregarCaracteristica = () => {
    if (característicaInput.trim()) {
      setCaracterísticas([...características, característicaInput])
      setCaracterísticaInput('')
    }
  }

  const eliminarCaracteristica = (index) => {
    setCaracterísticas(características.filter((_, i) => i !== index))
  }

  const handleImagenPrincipal = (e) => {
    setImagen(e.target.files[0])
  }

  const handleImagenesMultiples = (e) => {
    setImagenes(Array.from(e.target.files))
  }

  const handleModelo3d = (e) => {
    setModelo3d(e.target.files[0])
  }

  const onSubmit = async (e) => {
    console.log('Add.jsx onSubmit triggered')
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('nombre', nombre)
      formData.append('descripcion', descripcion)
      formData.append('caracteristicas', JSON.stringify(características))
      formData.append('stock', String(stock))
      formData.append('precio', precio)
      formData.append('categoria', categoria)
      formData.append('estiloDeSonido', estiloDeSonido)
      formData.append('tipoDeMusico', tipoDeMusico)
      formData.append('destaque', destaque)

      if (imagen) formData.append('imagen', imagen)
      imagenes.forEach((img) => formData.append('imagenes', img))
      
      // Validar y incluir modelo 3D
      if (modelo3d) {
        const ext = modelo3d.name.split('.').pop().toLowerCase()
        if (!['glb', 'gltf'].includes(ext)) {
          toast.error('Solo se aceptan archivos .glb o .gltf')
          setLoading(false)
          return
        }
        formData.append('modelo3d', modelo3d)
        toast.info('Subiendo modelo 3D a Land of Assets...')
      }

      const response = await axios.post(`${API_URL}/producto/crear`, formData, {
        headers: { 
          'x-access-token': token,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        toast.success('Producto creado exitosamente')
        // Limpiar formulario
        setNombre('')
        setDescripcion('')
        setCaracterísticas([])
        setPrecio('')
        setCategoria('pedales')
        setEstiloDeSonido('Distorsion')
        setTipoDeMusico('Principiante')
        setStock(0)
        setImagen(null)
        setImagenes([])
        setModelo3d(null)
        setDestaque(false)
      } else {
        toast.error(response.data.message || 'Error al crear el producto')
      }
    } catch (error) {
      console.log(error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error('Error al crear el producto')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='add-product'>
      <h2>Agregar Nuevo Producto</h2>
      <form onSubmit={onSubmit} className='add-form'>
        
        {/* Imagen Principal */}
        <div className='form-group'>
          <label>Imagen Principal</label>
          <input type='file' onChange={handleImagenPrincipal} accept='image/*' />
          {imagen && <p className='file-name'>{imagen.name}</p>}
        </div>

        {/* Múltiples Imágenes */}
        <div className='form-group'>
          <label>Imágenes Adicionales</label>
          <input type='file' onChange={handleImagenesMultiples} accept='image/*' multiple />
          <div className='files-list'>
            {imagenes.map((img, idx) => (
              <span key={idx}>{img.name}</span>
            ))}
          </div>
        </div>

        {/* Nombre */}
        <div className='form-group'>
          <label>Nombre del Producto*</label>
          <input
            type='text'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder='Ej: Flanger FL3'
          />
        </div>

        {/* Descripción */}
        <div className='form-group'>
          <label>Descripción*</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            placeholder='Describe el producto'
            rows='4'
          />
        </div>

        {/* Características */}
        <div className='form-group'>
          <label>Características</label>
          <div className='caracteristicas-input'>
            <input
              type='text'
              value={característicaInput}
              onChange={(e) => setCaracterísticaInput(e.target.value)}
              placeholder='Ej: Control de velocidad'
            />
            <button type='button' onClick={agregarCaracteristica} className='btn-add'>
              Agregar
            </button>
          </div>
          <div className='caracteristicas-list'>
            {características.map((car, idx) => (
              <div key={idx} className='caracteristica-item'>
                <span>{car}</span>
                <button
                  type='button'
                  onClick={() => eliminarCaracteristica(idx)}
                  className='btn-remove'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div className='form-group'>
          <label>Precio*</label>
          <input
            type='number'
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            placeholder='0.00'
          />
        </div>

        {/* Stock / Cantidad */}
        <div className='form-group'>
          <label>Cantidad (stock)</label>
          <input
            type='number'
            min='0'
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>

        {/* Categoría */}
        <div className='form-group'>
          <label>Categoría*</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value='pedales'>Pedales</option>
            <option value='accesorios'>Accesorios</option>
            <option value='servicios'>Servicios</option>
          </select>
        </div>

        {/* Estilo de Sonido */}
        <div className='form-group'>
          <label>Estilo de Sonido</label>
          <select value={estiloDeSonido} onChange={(e) => setEstiloDeSonido(e.target.value)}>
            <option value='Distorsion'>Distorsión</option>
            <option value='Delay'>Delay</option>
            <option value='Reverb'>Reverb</option>
          </select>
        </div>

        {/* Tipo de Músico */}
        <div className='form-group'>
          <label>Nivel de Músico</label>
          <select value={tipoDeMusico} onChange={(e) => setTipoDeMusico(e.target.value)}>
            <option value='Principiante'>Principiante</option>
            <option value='Intermedio'>Intermedio</option>
            <option value='Avanzado'>Avanzado</option>
            <option value='Profesional'>Profesional</option>
          </select>
        </div>

        {/* Modelo 3D (solo para pedales) */}
        {categoria === 'pedales' && (
          <div className='form-group'>
            <label>Modelo 3D (GLB/GLTF)</label>
            <input 
              type='file' 
              onChange={handleModelo3d} 
              accept='.glb,.gltf'
              disabled={loading}
            />
            {modelo3d && (
              <div className='file-info'>
                <p className='file-name'>✓ {modelo3d.name}</p>
                <small>Tamaño: {(modelo3d.size / 1024 / 1024).toFixed(2)} MB</small>
              </div>
            )}
          </div>
        )}

        {/* Destaque */}
        <div className='form-group checkbox'>
          <input
            type='checkbox'
            id='destaque'
            checked={destaque}
            onChange={() => setDestaque(!destaque)}
          />
          <label htmlFor='destaque'>Destacar en página principal</label>
        </div>

        <button
          type='submit'
          className='btn-submit'
          disabled={loading}
          onClick={() => console.log('Add.jsx button clicked')}
        >
          {loading ? 'Guardando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  )
}

export default Add
