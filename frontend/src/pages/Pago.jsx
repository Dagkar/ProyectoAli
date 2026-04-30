import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import '../styles/pages.css'

const Pago = () => {
  const { cartItems, products, token, user, backendUrl, clearCart } = useContext(ShopContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    tarjeta: '',
    metodo: 'tarjeta'
  })

  const [errors, setErrors] = useState({})

  const formatMoney = (num) => {
    const value = Number(num) || 0
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/Logo.png'
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    if (imagePath.startsWith('/uploads/')) return `${backendUrl}${imagePath}`
    return imagePath
  }

  // Calcular total
  const calcularTotal = () => {
    let total = 0
    for (const itemId in cartItems) {
      const product = products.find(p => p._id === itemId)
      if (product) {
        total += product.precio * cartItems[itemId]
      }
    }
    return total
  }

  if (!token) {
    return (
      <div className='pago-page'>
        <div className='checkout-container'>
          <p style={{ textAlign: 'center', padding: '40px' }}>
            Debes estar registrado para realizar una compra.{' '}
            <button
              onClick={() => navigate('/registro')}
              style={{
                background: '#ff8a00',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Ir a login
            </button>
          </p>
        </div>
      </div>
    )
  }

  const items = Object.keys(cartItems)
    .map(id => {
      const producto = products.find(p => p._id === id)
      return {
        ...producto,
        cantidad: cartItems[id]
      }
    })
    .filter(p => p._id)

  const total = calcularTotal()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let newValue = value
    let newErrors = { ...errors }

    // Validación de nombre (solo letras y espacios)
    if (name === 'nombre') {
      newValue = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, '')
    }

    // Validación de teléfono (solo números)
    if (name === 'telefono') {
      newValue = value.replace(/[^0-9]/g, '')
    }

    // Validación de tarjeta (solo números, máximo 16 dígitos)
    if (name === 'tarjeta') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 16)
    }

    // Validación de email
    if (name === 'email') {
      const emailRegex = /^[^\s@]*@?[^\s]*$/
      if (!emailRegex.test(value)) {
        newErrors.email = 'Email inválido'
      } else {
        delete newErrors.email
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
    setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones finales
    let finalErrors = {}
    if (!formData.nombre.trim()) finalErrors.nombre = 'Nombre requerido'
    if (!formData.email.trim()) finalErrors.email = 'Email requerido'
    if (!formData.telefono.trim()) finalErrors.telefono = 'Teléfono requerido'
    if (!formData.direccion.trim()) finalErrors.direccion = 'Dirección requerida'
    if (formData.metodo === 'tarjeta' && !formData.tarjeta) finalErrors.tarjeta = 'Tarjeta requerida'
    if (formData.metodo === 'tarjeta' && formData.tarjeta.length !== 16) finalErrors.tarjeta = 'La tarjeta debe tener 16 dígitos'
    if (!formData.email.includes('@')) finalErrors.email = 'Email inválido'

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors)
      toast.error('Por favor completa todos los campos correctamente')
      return
    }

    if (items.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    setLoading(true)

    try {
      const orderData = {
        usuario: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion
        },
        items: items.map(item => ({
          producto: item._id,
          cantidad: item.cantidad,
          precio: item.precio
        })),
        total: total,
        metodo_pago: formData.metodo,
        estado: 'pendiente'
      }

      const response = await axios.post(
        `${backendUrl}/api/pedidos`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        toast.success('Pedido creado exitosamente')
        clearCart()
        // Aquí normalmente irías a un gateway de pago como Stripe o PayPal
        // Por ahora, simplemente redirige al historial
        setTimeout(() => {
          navigate('/historial')
        }, 2000)
      } else {
        toast.error(response.data.message || 'Error al crear el pedido')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='pago-page'>
      <div className='checkout-container'>
        {/* Columna izquierda - Resumen */}
        <section className='checkout-left'>
          <h2>Resumen del Pedido</h2>
          
          {items.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Tu carrito está vacío</p>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: '#ff8a00',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              <div className='checkout-products'>
                {items.map(item => (
                  <div key={item._id} className='checkout-item'>
                    {item.imagen && (
                      <img src={getImageUrl(item.imagen)} alt={item.nombre} />
                    )}
                    <div className='checkout-item-details'>
                      <h4>{item.nombre}</h4>
                      <p>{item.cantidad} x ${formatMoney(item.precio)}</p>
                    </div>
                    <p className='checkout-item-total'>
                      ${formatMoney(item.cantidad * item.precio)}
                    </p>
                  </div>
                ))}
              </div>

              <div className='checkout-summary'>
                <div className='summary-row'>
                  <span>Subtotal:</span>
                  <span>${formatMoney(total)}</span>
                </div>
                <div className='summary-row'>
                  <span>Envío:</span>
                  <span>${formatMoney(50)}</span>
                </div>
                <div className='summary-row total'>
                  <span>Total:</span>
                  <span>${formatMoney(total + 50)}</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Columna derecha - Formulario */}
        <section className='checkout-right'>
          <h2>Información de Envío</h2>
          <form onSubmit={handleSubmit} className='checkout-form'>
            <div className='form-group'>
              <label>Nombre Completo *</label>
              <input
                type='text'
                name='nombre'
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder='Tu nombre'
                required
              />
              {errors.nombre && <span className='error'>{errors.nombre}</span>}
            </div>

            <div className='form-group'>
              <label>Email *</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='tu@email.com'
                required
              />
              {errors.email && <span className='error'>{errors.email}</span>}
            </div>

            <div className='form-group'>
              <label>Teléfono *</label>
              <input
                type='tel'
                name='telefono'
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder='Tu teléfono'
                required
              />
              {errors.telefono && <span className='error'>{errors.telefono}</span>}
            </div>

            <div className='form-group'>
              <label>Dirección de Envío *</label>
              <textarea
                name='direccion'
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder='Calle, número, ciudad, estado, código postal'
                rows='3'
                required
              ></textarea>
              {errors.direccion && <span className='error'>{errors.direccion}</span>}
            </div>

            <div className='form-group'>
              <label>Método de Pago *</label>
              <select
                name='metodo'
                value={formData.metodo}
                onChange={handleInputChange}
              >
                <option value='tarjeta'>Tarjeta de Crédito/Débito</option>
                <option value='transferencia'>Transferencia Bancaria</option>
                <option value='efectivo'>Efectivo en Entrega</option>
              </select>
            </div>

            {formData.metodo === 'tarjeta' && (
              <div className='form-group'>
                <label>Número de Tarjeta *</label>
                <input
                  type='text'
                  name='tarjeta'
                  value={formData.tarjeta}
                  onChange={handleInputChange}
                  placeholder='1234 5678 9012 3456'
                  maxLength='16'
                  inputMode='numeric'
                  required
                />
                {errors.tarjeta && <span className='error'>{errors.tarjeta}</span>}
                <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>16 dígitos sin espacios</small>
              </div>
            )}

            <button
              type='submit'
              className='btn-checkout'
              disabled={loading || items.length === 0}
            >
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>

            <button
              type='button'
              className='btn-back'
              onClick={() => navigate('/carrito')}
            >
              Volver al Carrito
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Pago
