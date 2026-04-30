import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../App'
import { toast } from 'react-toastify'

const Users = ({ token }) => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [cambiarPasswordForm, setCambiarPasswordForm] = useState(null)
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)

  useEffect(() => {
    if (token) {
      obtenerUsuarios()
    }
  }, [token])

  const obtenerUsuarios = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/auth/admin-clientes`, {
        headers: {
          'x-access-token': token,
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setUsuarios(response.data.usuarios)
      } else {
        toast.error(response.data.message || 'No se pudieron cargar los clientes')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await axios.delete(`${BACKEND_URL}/api/auth/admin-clientes/${id}`, {
        headers: {
          'x-access-token': token,
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        toast.success('Usuario eliminado')
        obtenerUsuarios()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al eliminar usuario')
    }
  }

  const abrirFormularioCambiarPassword = (usuario) => {
    setCambiarPasswordForm(usuario)
    setNuevaPassword('')
  }

  const cambiarPassword = async () => {
    if (!nuevaPassword || nuevaPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      setLoadingPassword(true)
      const response = await axios.put(
        `${BACKEND_URL}/api/auth/admin-clientes/${cambiarPasswordForm._id}/cambiar-password`,
        { nuevaPassword },
        { headers: { 'x-access-token': token, 'Authorization': `Bearer ${token}` } }
      )

      if (response.data.success) {
        toast.success('Contraseña actualizada')
        setCambiarPasswordForm(null)
        setNuevaPassword('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al cambiar contraseña')
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className='users-management'>
      <h2>Gestión de Clientes</h2>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <>
          <p className='user-count'>Total de clientes: <strong>{usuarios.length}</strong></p>
          
          <div className='users-table'>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario._id}>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefono || '-'}</td>
                      <td>{usuario.direccion || '-'}</td>
                      <td>{new Date(usuario.createdAt).toLocaleDateString('es-ES')}</td>
                      <td className='actions'>
                        <button
                          onClick={() => abrirFormularioCambiarPassword(usuario)}
                          className='btn-change-password'
                          title='Cambiar contraseña'
                        >
                          🔑 Contraseña
                        </button>
                        <button
                          onClick={() => eliminarUsuario(usuario._id)}
                          className='btn-delete'
                          title='Eliminar usuario'
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='6' style={{ textAlign: 'center', padding: '20px' }}>
                      No hay clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal para cambiar contraseña */}
      {cambiarPasswordForm && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h3>Cambiar Contraseña</h3>
            <p className='modal-user-email'>{cambiarPasswordForm.email}</p>
            
            <div className='form-group'>
              <label>Nueva Contraseña</label>
              <input
                type='password'
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder='Mínimo 6 caracteres'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') cambiarPassword()
                }}
              />
            </div>

            <div className='modal-buttons'>
              <button
                onClick={cambiarPassword}
                className='btn-save'
                disabled={loadingPassword}
              >
                {loadingPassword ? 'Actualizando...' : 'Actualizar'}
              </button>
              <button
                onClick={() => {
                  setCambiarPasswordForm(null)
                  setNuevaPassword('')
                }}
                className='btn-cancel'
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
