import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductItem from '../components/ProductItem'
import { ShopContext } from '../context/ShopContext'
import '../styles/pages.css'

const Home = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const { backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/Logo.png'
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    if (imagePath.startsWith('/uploads/')) return `${backendUrl}${imagePath}`
    return imagePath
  }

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/productos`)
        const data = await response.json()
        const productosData = Array.isArray(data) ? data : (data.productos || [])
        const destacados = productosData
          .filter((producto) => producto.categoria === 'pedales')
          .slice(0, 6)
        setProductos(destacados)
      } catch (error) {
        console.error('Error cargando productos:', error)
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [])

  return (
    <div className="home-page">
      {/* Banner ATONE */}
      <section className="atone-banner">
        <div className="banner-content">
          <h1>ATONE</h1>
          <p className="banner-subtitle">Tu tienda especializada en pedales de efectos y accesorios musicales</p>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories-section">
        <div className="categories-container">
          <div 
            className="category-card pedal-card"
            onClick={() => navigate('/catalogo?categoria=pedales')}
            style={{ backgroundImage: 'url(/img/Fondo1.png)' }}
          >
            <div className="category-overlay">
              <h3>Pedales</h3>
              <p>Descubre nuestra colección de pedales de efectos</p>
            </div>
          </div>

          <div 
            className="category-card servicios-card"
            onClick={() => navigate('/catalogo?categoria=servicios')}
            style={{ backgroundImage: 'url(/img/Fondo2.png)' }}
          >
            <div className="category-overlay">
              <h3>Servicios</h3>
              <p>Mantenimiento y reparación de instrumentos</p>
            </div>
          </div>

          <div 
            className="category-card articulos-card"
            onClick={() => navigate('/catalogo?categoria=accesorios')}
            style={{ backgroundImage: 'url(/img/Fondo3.png)' }}
          >
            <div className="category-overlay">
              <h3>Artículos</h3>
              <p>Accesorios y complementos musicales</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <h2>Productos Destacados</h2>
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="products-grid">
              {productos.length > 0 ? (
              productos.map(producto => (
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
              <p>No hay productos disponibles</p>
            )}
          </div>
        )}
      </section>

      {/* Carrusel de Reseñas */}
      <section className="reviews-carousel">
        <h2>Lo Que Dicen Nuestros Clientes</h2>
        <div className="reviews-container">
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p className="review-text">"Excelente calidad en los pedales, muy recomendado"</p>
            <p className="review-author">- Juan García</p>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p className="review-text">"El mejor servicio técnico que he encontrado"</p>
            <p className="review-author">- María López</p>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p className="review-text">"Precios justos y entrega rápida"</p>
            <p className="review-author">- Carlos Rodríguez</p>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <h2>¿Por Qué Elegirnos?</h2>
        <div className="features">
          <div className="feature-item">
            <h3>Calidad Garantizada</h3>
            <p>Todos nuestros pedales son de alta calidad y garantizados</p>
          </div>
          <div className="feature-item">
            <h3>Envío Rápido</h3>
            <p>Entrega a domicilio en toda la región</p>
          </div>
          <div className="feature-item">
            <h3>Soporte 24/7</h3>
            <p>Equipo de atención al cliente siempre disponible</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
