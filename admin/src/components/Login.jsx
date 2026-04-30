import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BACKEND_URL } from '../App'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/admin-login`, {
        email,
        password
      })

      if (response.data.success) {
        setToken(response.data.token)
        toast.success('Login exitoso')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error en login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-page'>
      <div className='login-box'>
        <h2>ATONE Admin</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
          Demo: admin@atone.com / admin123
        </p>
      </div>
    </div>
  )
}

export default Login
