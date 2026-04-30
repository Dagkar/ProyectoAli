import React from 'react'

const Navbar = ({ setToken }) => {
  return (
    <nav className='admin-navbar'>
      <div className='navbar-content'>
        <h1>🎸 ATONE ADMIN</h1>
        <button onClick={() => {
          setToken('')
          localStorage.removeItem('adminToken')
        }} className='btn-logout'>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar
