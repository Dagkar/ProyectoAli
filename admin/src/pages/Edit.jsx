import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../App'
import { toast } from 'react-toastify'

const Edit = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarProducto()
  }, [])

  const cargarProducto = async () => {
    try {
      const response = await axios.get(`${API_URL}/productos`, {
        headers: { 'x-access-token': token }
      })

      if (response.data.success) {
        const prod = response.data.productos.find(p => p._id === id)
        if (prod) {
          setNombre(prod.nombre)
          setDescripcion(prod.descripcion)
          setCaracterísticas(prod.caracteristicas || prod.características || [])
          setPrecio(prod.precio)
          setCategoria(prod.categoria)
          setEstiloDeSonido(prod.estiloDeSonido || 'Distorsion')
          setTipoDeMusico(prod.tipoDeMusico)
          setDestaque(prod.destaque)
          setStock(prod.stock || 0)
        }
      }
    } catch (error) {
      toast.error('Error al cargar el producto')
    } finally {
      setLoading(false)
    }
  }

  const agregarCaracteristica = () => {
    if (característicaInput.trim()) {
      setCaracterísticas([...características, característicaInput])
      setCaracterísticaInput('')
    }
  }

  const eliminarCaracteristica = (index) => {
    setCaracterísticas(características.filter((_, i) => i !== index))
  }

  const onSubmit = async (e) => {
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
      if (modelo3d) formData.append('modelo3d', modelo3d)

      const response = await axios.put(`${API_URL}/producto/${id}`, formData, {
        headers: { 
          'x-access-token': token
        }
      })

      if (response.data.success) {
        toast.success('Producto actualizado')
        setTimeout(() => navigate('/list'), 500)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div className='edit-product'>
      <h2>Editar Producto</h2>
      <form onSubmit={onSubmit} className='edit-form'>
        
        {/* Imagen Principal */}
        <div className='form-group'>
          <label>Imagen Principal (Cambiar)</label>
          <input type='file' onChange={(e) => setImagen(e.target.files[0])} accept='image/*' />
          {imagen && <p className='file-name'>{imagen.name}</p>}
        </div>

        {/* Múltiples Imágenes */}
        <div className='form-group'>
          <label>Imágenes Adicionales (Cambiar)</label>
          <input 
            type='file' 
            onChange={(e) => setImagenes(Array.from(e.target.files))} 
            accept='image/*' 
            multiple 
          />
          <div className='files-list'>
            {imagenes.map((img, idx) => (
              <span key={idx}>{typeof img === 'string' ? img : img.name}</span>
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
          />
        </div>

        {/* Descripción */}
        <div className='form-group'>
          <label>Descripción*</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
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
            <label>Modelo 3D (GLB/GLTF) - Cambiar</label>
            <input type='file' onChange={(e) => setModelo3d(e.target.files[0])} accept='.glb,.gltf' />
            {modelo3d && <p className='file-name'>{modelo3d.name}</p>}
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type='submit' disabled={loading} className='btn-submit'>
            {loading ? 'Guardando...' : 'Actualizar Producto'}
          </button>
          <button 
            type='button' 
            onClick={() => navigate('/list')} 
            className='btn-cancel'
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Edit
