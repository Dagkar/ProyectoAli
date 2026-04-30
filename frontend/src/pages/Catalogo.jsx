import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductItem from '../components/ProductItem'
import SearchBar from '../components/SearchBar'
import { ShopContext } from '../context/ShopContext'
import '../styles/pages.css'

const Catalogo = ({ tipo = 'pedales' }) => {
  const [searchParams] = useSearchParams()
  const categoriaParam = searchParams.get('categoria')
  const tipoFinal = categoriaParam || tipo
  const [productos, setProductos] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [estiloFilter, setEstiloFilter] = useState('')
  const { backendUrl } = useContext(ShopContext)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/Logo.png'
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    if (imagePath.startsWith('/uploads/')) return `${backendUrl}${imagePath}`
    return imagePath
  }

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${backendUrl}/api/productos`)
        const data = await response.json()
        const productosData = Array.isArray(data) ? data : (data.productos || [])
        const filtradosPorCategoria = productosData.filter((producto) => producto.categoria === tipoFinal)
        setProductos(filtradosPorCategoria)
        setFiltrados(filtradosPorCategoria)
      } catch (error) {
        console.error('Error cargando catálogo:', error)
        setProductos([])
        setFiltrados([])
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [tipoFinal, backendUrl])

  const handleSearch = (term) => {
    if (term.trim() === '') {
      setFiltrados(productos)
    } else {
      const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(term.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(term.toLowerCase())
      )
      setFiltrados(filtered)
    }
  }

  const handleEstiloChange = (value) => {
    setEstiloFilter(value)
    if (!value) {
      setFiltrados(productos)
      return
    }
    const filtered = productos.filter(p => (p.estiloDeSonido || '').toLowerCase() === value.toLowerCase())
    setFiltrados(filtered)
  }

  const getSubtitle = () => {
    const subtitles = {
      pedales: 'Descubre nuestra variedad de pedales de efectos para guitarra',
      accesorios: 'Accesorios musicales de calidad para tu instrumento',
      servicios: 'Servicios profesionales de audio y ajuste de instrumentos'
    }
    return subtitles[tipoFinal] || 'Explora nuestro catálogo'
  }

  return (
      <div className="catalogo-page">
      <section className="atone-banner atone-banner--full">
        <div className="banner-content">
      <h1>{tipoFinal.charAt(0).toUpperCase() + tipoFinal.slice(1)}</h1>
      <p className="banner-subtitle">{getSubtitle()}</p>
      </div>
      </section>

      <div className='catalogo-content'>
      <div className='catalog-filters'>
        <SearchBar onSearch={handleSearch} />
        <div className='filter-estilo'>
          <label>Estilo:</label>
          <select value={estiloFilter} onChange={(e) => handleEstiloChange(e.target.value)}>
            <option value=''>Todos</option>
            <option value='Distorsion'>Distorsion</option>
            <option value='Delay'>Delay</option>
            <option value='Reverb'>Reverb</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading">Cargando productos...</p>
      ) : (
        <div className="products-grid">
          {filtrados.length > 0 ? (
            filtrados.map(producto => (
              <ProductItem
                key={producto._id}
                id={producto._id}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
                stock={producto.stock}
              />
            ))
          ) : (
            <p className="no-products">No se encontraron productos</p>
          )}
        </div>
      )}
      </div>
    </div>
  )
}

export default Catalogo
