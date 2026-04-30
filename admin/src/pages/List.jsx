import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL, BACKEND_URL } from '../App'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [productos, setProductos] = useState([])
  const [filtro, setFiltro] = useState('pedales')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    obtenerProductos()
  }, [filtro])

  const obtenerProductos = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/productos?categoria=${filtro}`, {
        headers: { 'x-access-token': token }
      })

      if (response.data.success) {
        setProductos(response.data.productos)
      }
    } catch (error) {
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/Logo.png'
    // Cloudinary URLs se retornan directamente
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    // Rutas locales antiguas se ignoran
    return '/img/Logo.png'
  }

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    try {
      const response = await axios.delete(`${API_URL}/producto/${id}`, {
        headers: { 'x-access-token': token }
      })

      if (response.data.success) {
        toast.success('Producto eliminado')
        obtenerProductos()
      }
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div className='list-products'>
      <h2>Lista de Productos</h2>

      <div className='filter-section'>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value='pedales'>Pedales</option>
          <option value='accesorios'>Accesorios</option>
          <option value='servicios'>Servicios</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className='products-table'>
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Estilo Sonido</th>
                <th>Nivel</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Destaque</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod._id}>
                  <td>
                    {prod.imagen && (
                      <img src={getImageUrl(prod.imagen)} alt={prod.nombre} className='thumb' />
                    )}
                  </td>
                  <td>{prod.nombre}</td>
                  <td>{prod.categoria}</td>
                  <td>{prod.estiloDeSonido}</td>
                  <td>{prod.tipoDeMusico}</td>
                  <td>{prod.stock ?? 0}</td>
                  <td>${prod.precio}</td>
                  <td>{prod.destaque ? '✓' : '✗'}</td>
                  <td className='actions'>
                    <button
                      onClick={() => navigate(`/edit/${prod._id}`)}
                      className='btn-edit'
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(prod._id)}
                      className='btn-delete'
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default List
