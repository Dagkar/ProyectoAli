import React, { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import '../styles/navbar.css'

const Navbar = () => {
  const { token, logout, cartItems } = useContext(ShopContext)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header>
      {/* Logo a la izquierda */}
      <div className="logo">
        <img src="/img/Logo.png" alt="ATONE" height="50" />
      </div>

      {/* Menú centrado */}
      <nav className="main-nav">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Inicio</Link>
        <Link to="/catalogo-pedales" className={`nav-link ${isActive('/catalogo-pedales') ? 'active' : ''}`}>Catálogo</Link>
        <Link to="/catalogo-servicios" className={`nav-link ${isActive('/catalogo-servicios') ? 'active' : ''}`}>Servicio</Link>
        <Link to="/nosotros" className={`nav-link ${isActive('/nosotros') ? 'active' : ''}`}>Nosotros</Link>
        <Link to="/catalogo-accesorios" className={`nav-link ${isActive('/catalogo-accesorios') ? 'active' : ''}`}>Accesorios</Link>
        <Link to="/asistente" className={`nav-link ${isActive('/asistente') ? 'active' : ''}`}>Asistente</Link>
        <Link to="/ayuda" className={`nav-link ${isActive('/ayuda') ? 'active' : ''}`}>Ayuda</Link>
      </nav>

      {/* Íconos a la derecha */}
      <div className="icons">
        {token && (
          <Link to="/carrito" className="cart-icon-container">
            <img src="/img/Icono2.png" alt="Carrito" />
            {cartCount > 0 && <span className="cart-badge show">{cartCount}</span>}
          </Link>
        )}
        
        <div className="user-menu">
          <img
            src="/img/user-icon.png"
            alt="Usuario"
            className="user-icon"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ cursor: 'pointer' }}
          />
          {showUserMenu && (
            <div className="dropdown-content" style={{ display: 'block' }}>
              {token ? (
                <>
                  <Link to="/historial" className="dropdown-item">Mis Pedidos</Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item">Ingresar</Link>
                  <Link to="/registro" className="dropdown-item">Registrarse</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
