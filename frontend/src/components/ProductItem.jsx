import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import '../styles/product-item.css'

const ProductItem = ({ id, nombre, precio, imagen, stock }) => {
  const { addToCart, backendUrl, token } = useContext(ShopContext)
  const navigate = useNavigate()

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/Logo.png'
    // Cloudinary URLs y URLs HTTP/HTTPS se retornan directamente
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    // Rutas locales antiguas (si existen) se ignoran
    return '/img/Logo.png'
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleAddToCart = () => {
    if (!token) {
      navigate('/registro')
      return
    }
    if (stock <= 0) return
    addToCart(id, 1)
  }

  return (
    <div className={`product-item ${stock <= 0 ? 'out-of-stock' : ''}`}>
      <div className={`stock-info ${stock <= 0 ? 'stock-empty' : 'stock-available'}`}>
        {stock <= 0 ? 'Agotado' : `En stock: ${stock}`}
      </div>
      <button type="button" onClick={() => navigate(`/producto/${id}`)} className="product-link">
        <img src={getImageUrl(imagen)} alt={nombre} className="product-image" />
      </button>
      <h3>{nombre}</h3>
      <p className="producto-precio">${formatNumber(parseFloat(precio).toFixed(0))}.{(parseFloat(precio) % 1).toFixed(2).split('.')[1]}</p>
      {stock <= 0 ? null : !token ? (
        <button onClick={handleAddToCart} className="add-to-cart-btn">
          Comprar / Registrarse
        </button>
      ) : (
        <button onClick={handleAddToCart} className="add-to-cart-btn">
          Agregar al Carrito
        </button>
      )}
    </div>
  )
}

export default ProductItem
