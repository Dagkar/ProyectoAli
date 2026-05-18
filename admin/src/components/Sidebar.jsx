import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className='admin-sidebar'>
      <nav>
        <div className='sidebar-section'>
          <h3>Productos</h3>
          <Link to='/add' className='sidebar-link'>
            ➕ Agregar Producto
          </Link>
          <Link to='/list' className='sidebar-link'>
            📋 Lista de Productos
          </Link>
        </div>

        <div className='sidebar-section'>
          <h3>Administración</h3>
          <Link to='/users' className='sidebar-link'>
            👥 Gestión de Clientes
          </Link>
          <Link to='/pedidos' className='sidebar-link'>
            🧾 Pedidos Realizados
          </Link>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
