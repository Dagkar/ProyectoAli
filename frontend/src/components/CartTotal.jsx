import React from 'react'
import '../styles/cart-total.css'

const CartTotal = ({ total, itemCount, onCheckout }) => {
  const formatNumber = (num) => {
    if (!num) return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <div className="cart-total-container">
      <h2>Resumen del Carrito</h2>
      <div className="cart-info">
        <p>Items: <span>{itemCount}</span></p>
        <p>Total: <span className="total-price">${formatNumber(total.toFixed(0))}.{(total % 1).toFixed(2).split('.')[1]}</span></p>
      </div>
      <button onClick={onCheckout} className="checkout-btn">
        Proceder al Pago
      </button>
    </div>
  )
}

export default CartTotal
