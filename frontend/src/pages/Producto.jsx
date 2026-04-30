import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import '../styles/producto.css'

const Producto = () => {
  const { id } = useParams()
  const { addToCart, backendUrl, token } = useContext(ShopContext)
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [activeTab, setActiveTab] = useState('especificaciones')
  const [currentSlide, setCurrentSlide] = useState(0)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/Logo.png'
    // URLs completas (Cloudinary, Land of Assets, etc) se retornan directamente
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    // Rutas locales antiguas se ignoran
    return '/img/Logo.png'
  }

  const getModel3dUrl = (modelPath) => {
    if (!modelPath) return ''
    // URLs completas (Land of Assets) se retornan directamente
    if (modelPath.startsWith('http://') || modelPath.startsWith('https://')) return modelPath
    // Rutas relativas se concatenan con backendUrl
    return `${backendUrl}${modelPath}`
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/productos/${id}`)
        const data = await response.json()
        if (data.success) {
          setProducto(data.producto)
        } else {
          setProducto(null)
        }
      } catch (error) {
        console.error('Error cargando producto:', error)
        setProducto(null)
      }
    }

    if (id) {
      cargarProducto()
    }
  }, [id, backendUrl])

  const cambiarCantidad = (delta) => {
    if (!producto) return
    const nuevo = Math.max(1, cantidad + delta)
    const maxAllowed = producto.stock || 1
    setCantidad(Math.min(nuevo, maxAllowed))
  }

  const moveSlide = (direction) => {
    const totalSlides = (producto.imagenes && producto.imagenes.length) || 1
    setCurrentSlide((prev) => {
      if (direction === 'next') {
        return (prev + 1) % totalSlides
      } else {
        return (prev - 1 + totalSlides) % totalSlides
      }
    })
  }

  const handleAddToCart = () => {
    if (!producto) return
    if (!token) {
      navigate('/registro')
      return
    }
    if ((producto.stock || 0) <= 0) return
    const toAdd = Math.min(cantidad, producto.stock || cantidad)
    addToCart(id, toAdd)
    setCantidad(1)
  }

  const handleComprarAhora = () => {
    if (!token) {
      navigate('/registro')
      return
    }
    handleAddToCart()
    navigate('/pago')
  }

  if (!producto) {
    return <div className="loading-page">Cargando producto...</div>
  }

  const slides = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : [producto.imagen]

  return (
    <div className="producto-page">
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'especificaciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('especificaciones')}
          >
            Especificaciones
          </button>
          {producto.categoria === 'pedales' && producto.modelo3d && (
            <button
              className={`tab-button ${activeTab === 'modelo3d' ? 'active' : ''}`}
              onClick={() => setActiveTab('modelo3d')}
            >
              Modelo 3D
            </button>
          )}
        </div>

        <div className={`tab-content ${activeTab === 'especificaciones' ? 'active' : ''}`}>
          <div className="detalle-producto">
            <div className="detalle-izq">
              <div className="product-carousel">
                {slides.map((s, i) => (
                  <div key={i} className={`product-slide ${i === currentSlide ? 'active' : ''}`}>
                    <img src={getImageUrl(s)} alt={`${producto.nombre} ${i + 1}`} />
                  </div>
                ))}
              </div>
              {slides.length > 1 && (
                <>
                  <button className="product-prev" onClick={() => moveSlide('prev')}>
                    ‹
                  </button>
                  <button className="product-next" onClick={() => moveSlide('next')}>
                    ›
                  </button>
                </>
              )}
              <div className="stock-info">
                {producto.stock > 0 ? (
                  <span className="in-stock">En stock: {producto.stock}</span>
                ) : (
                  <span className="out-of-stock">Sin stock</span>
                )}
              </div>
            </div>

            <div className="detalle-der">
              <h2>{producto.nombre}</h2>
              <p className="precio">${formatNumber(parseFloat(producto.precio).toFixed(0))}.{(parseFloat(producto.precio) % 1).toFixed(2).split('.')[1]}</p>
              <ul className="caracteristicas">
                {producto.caracteristicas?.map((car, i) => (
                  <li key={i}>{car}</li>
                ))}
              </ul>
              <div className="cantidad">
                <button onClick={() => cambiarCantidad(-1)}>-</button>
                <input type="number" value={cantidad} readOnly />
                <button onClick={() => cambiarCantidad(1)}>+</button>
              </div>
              <div className="botones-compra">
                {producto.stock > 0 ? (
                  <>
                    <button className="btn-carrito" onClick={handleAddToCart}>
                      Agregar al Carrito
                    </button>
                    <button className="btn-comprar" onClick={handleComprarAhora}>Comprar Ahora</button>
                  </>
                ) : (
                  <button className="btn-carrito btn-agotado" disabled>
                    AGOTADO
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="modelo3d-specs">
            {producto.especificaciones?.map((spec, i) => (
              <div key={i} className="spec-card">
                <h4>{spec.nombre}</h4>
                <p>{spec.valor}</p>
              </div>
            ))}
          </div>
        </div>

        {producto.categoria === 'pedales' && producto.modelo3d && (
        <div className={`tab-content ${activeTab === 'modelo3d' ? 'active' : ''}`}>
          <div className="modelo3d-container">
            <h2>Vista 3D Interactiva</h2>
            <div className="model-viewer-wrapper">
              {producto.modelo3d ? (
                <>
                  <model-viewer
                    src={getModel3dUrl(producto.modelo3d)}
                    alt={producto.nombre}
                    autoRotate
                    cameraControls
                    arSession
                  ></model-viewer>
                  <div style={{ display: 'none' }} className="loading-message">
                    Cargando modelo 3D...
                  </div>
                </>
              ) : (
                <div className="loading-message">Modelo 3D no disponible</div>
              )}
            </div>
            <div className="controls-info">
              <p>
                <strong>Controles:</strong> Usa el ratón para rotar, scroll para zoom, o mantén presionado para mover.
              </p>
              <p>
                <strong>Dispositivos móviles:</strong> Toca y arrastra para rotar, pellizca para zoom.
              </p>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default Producto
