import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'
import '../styles/pages.css'

const Carrito = () => {
  const { cartItems, customItems, removeFromCart, updateCartItemQty, token, backendUrl } = useContext(ShopContext)
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/productos`)
        if (response.data.success) {
          setProductos(response.data.productos || [])
        } else {
          setProductos([])
        }
      } catch (error) {
        console.error('Error cargando productos del carrito:', error)
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    cargarProductos()
  }, [backendUrl])

  const cartProductos = [
    ...Object.keys(cartItems)
      .map(id => {
        const producto = productos.find(p => p._id === id) || productos.find(p => p.id === id)
        return producto ? { ...producto, cantidad: cartItems[id], esPersonalizado: false, itemId: id } : null
      })
      .filter(Boolean),
    ...Object.keys(customItems || {}).map(id => ({
      ...customItems[id],
      itemId: id,
      cantidad: customItems[id]?.quantity || 1,
      esPersonalizado: true,
      precio: Number(customItems[id]?.precio) || 0,
      imagen: customItems[id]?.imagen || customItems[id]?.personalizacion?.referenciaArchivo || '/img/Logo.png'
    }))
  ]

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/Logo.png'
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    if (imagePath.startsWith('/uploads/')) return `${backendUrl}${imagePath}`
    return imagePath
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const total = cartProductos.reduce((sum, p) => sum + (Number(p.precio) * p.cantidad), 0)

  const handleCheckout = () => {
    if (!token) {
      navigate('/registro')
      return
    }
    // Aquí irían a la página de pago
    navigate('/pago')
  }

  if (loading) return <div className="carrito-page"><p>Cargando...</p></div>

  return (
    <div className="carrito-page">
      <h1>Mi Carrito</h1>

      {cartProductos.length === 0 ? (
        <div className="empty-cart">
          <p>{token ? 'Tu carrito está vacío' : 'Debes registrarte para usar el carrito'}</p>
          <button onClick={() => navigate(token ? '/' : '/registro')}>
            {token ? 'Volver a tienda' : 'Ir a registrarme'}
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartProductos.map(producto => (
              <div key={producto._id || producto.id || producto.itemId} className="cart-item">
                <img src={getImageUrl(producto.imagen)} alt={producto.nombre} />
                <div className="item-details">
                  <h3>{producto.nombre}</h3>
                  {producto.esPersonalizado && (
                    <p style={{ margin: '0 0 8px', color: '#ff8a00', fontWeight: 700 }}>Solicitud de personalización</p>
                  )}
                  <p className="price">${formatNumber(Number(producto.precio).toFixed(0))}.{(Number(producto.precio) % 1).toFixed(2).split('.')[1]}</p>
                  {producto.esPersonalizado && producto.personalizacion && (
                    <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555', lineHeight: '1.5' }}>
                      <p><strong>Tipo:</strong> {producto.personalizacion.tipoPedal || '-'}</p>
                      <p><strong>Sonido:</strong> {(producto.personalizacion.estiloSonido || []).join(', ') || '-'}</p>
                      <p><strong>Enclosure:</strong> {producto.personalizacion.enclosureColor || '-'}</p>
                      <p><strong>Knobs:</strong> {producto.personalizacion.knobColor || '-'}</p>
                      <p><strong>LED:</strong> {producto.personalizacion.ledColor || '-'}</p>
                    </div>
                  )}
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateCartItemQty(producto._id || producto.id || producto.itemId, Math.max(1, producto.cantidad - 1))}>-</button>
                  <input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => updateCartItemQty(producto._id || producto.id || producto.itemId, parseInt(e.target.value) || 1)}
                    min="1"
                    max={producto.stock || 999}
                  />
                  <button 
                    onClick={() => updateCartItemQty(producto._id || producto.id || producto.itemId, producto.cantidad + 1)}
                    disabled={!producto.esPersonalizado && producto.cantidad >= producto.stock}
                  >
                    +
                  </button>
                </div>
                <p className="subtotal">${formatNumber((Number(producto.precio) * producto.cantidad).toFixed(0))}.{(((Number(producto.precio) * producto.cantidad)) % 1).toFixed(2).split('.')[1]}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(producto._id || producto.id || producto.itemId)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {Object.keys(customItems || {}).length > 0 && (
            <p style={{ marginTop: '12px', color: '#666', fontSize: '0.92rem' }}>
              Las solicitudes personalizadas se envían para cotización con todas sus características.
            </p>
          )}

          <CartTotal
            total={total}
            itemCount={cartProductos.reduce((sum, p) => sum + p.cantidad, 0)}
            onCheckout={handleCheckout}
          />
        </>
      )}
    </div>
  )
}

export default Carrito
