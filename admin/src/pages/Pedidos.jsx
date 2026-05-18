import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../App'
import { toast } from 'react-toastify'

const Pedidos = ({ token }) => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [imagenAmplia, setImagenAmplia] = useState('')

  useEffect(() => {
    obtenerPedidos()
  }, [])

  const obtenerPedidos = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/pedidos`, {
        headers: { 'x-access-token': token }
      })

      if (response.data.success) {
        setPedidos(response.data.pedidos || [])
      } else {
        toast.error(response.data.message || 'No se pudieron cargar los pedidos')
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
      toast.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const formatMoney = (value) => {
    const number = Number(value) || 0
    return number.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const getPersonalizacion = (item) => item.personalizacion || {}

  const abrirImagen = (url) => {
    if (!url) return
    setImagenAmplia(url)
  }

  const descargarImagen = async (url, nombre = 'referencia') => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `${nombre}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error('Error descargando imagen:', error)
      toast.error('No se pudo descargar la imagen')
    }
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const resp = await axios.put(`${API_URL}/pedidos/${id}/estado`, { estado: nuevoEstado }, {
        headers: { 'x-access-token': token }
      })
      if (resp.data.success) {
        toast.success('Estado actualizado')
        obtenerPedidos()
      } else {
        toast.error(resp.data.message || 'No se pudo actualizar')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error al actualizar estado')
    }
  }

  if (loading) {
    return <div className='list-products'><p>Cargando pedidos...</p></div>
  }

  return (
    <div className='list-products'>
      <h2>Pedidos Realizados</h2>

      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <div style={{ display: 'grid', gap: '18px' }}>
          {pedidos.map((pedido) => (
            <article
              key={pedido._id}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                padding: '18px',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px' }}>Pedido #{pedido._id?.substring(0, 8).toUpperCase()}</h3>
                  <p style={{ margin: 0, color: '#64748b' }}>
                    {new Date(pedido.createdAt).toLocaleString('es-MX')}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '999px', background: '#111827', color: '#fff', fontSize: '0.82rem' }}>
                    {pedido.estado}
                  </span>
                  <p style={{ margin: '8px 0 0', fontWeight: 700 }}>${formatMoney(pedido.total)}</p>
                  {/* Acción admin para pedidos con personalización: permitir toggle pendiente <-> pagado */}
                  {pedido.items && pedido.items.some(it => it.esPersonalizado || (it.personalizacion && Object.keys(it.personalizacion || {}).length > 0)) && (
                    <div style={{ marginTop: 8 }}>
                      <button
                        type='button'
                        onClick={() => cambiarEstado(pedido._id, pedido.estado === 'pendiente' ? 'pagado' : 'pendiente')}
                        style={{ padding: '8px 12px', borderRadius: 8, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer' }}
                      >
                        {pedido.estado === 'pendiente' ? 'Marcar como Pagado' : 'Marcar como Pendiente'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '16px', color: '#334155' }}>
                <div><strong>Cliente:</strong> {pedido.usuario?.nombre || 'Sin nombre'}</div>
                <div><strong>Email:</strong> {pedido.usuario?.email || '-'}</div>
                <div><strong>Teléfono:</strong> {pedido.usuario?.telefono || '-'}</div>
                <div><strong>Método:</strong> {pedido.metodo_pago || '-'}</div>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {pedido.items?.map((item, index) => {
                  const personalizacion = getPersonalizacion(item)
                  return (
                    <div
                      key={`${pedido._id}-${index}`}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '14px',
                        background: item.esPersonalizado ? '#fff7ed' : '#f8fafc'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                          <strong>{item.nombre || 'Sin nombre'}</strong>
                          {item.esPersonalizado && (
                            <span style={{ marginLeft: '8px', color: '#ea580c', fontWeight: 700, fontSize: '0.85rem' }}>
                              Personalizado
                            </span>
                          )}
                          <p style={{ margin: '6px 0 0', color: '#475569' }}>
                            {item.cantidad} unidad(es) · ${formatMoney(item.precio)} c/u
                          </p>
                        </div>
                        <div style={{ fontWeight: 700 }}>
                          ${formatMoney((Number(item.precio) || 0) * (item.cantidad || 0))}
                        </div>
                      </div>

                      {item.esPersonalizado && (
                        <div style={{ marginTop: '12px', color: '#334155', fontSize: '0.92rem', lineHeight: '1.55' }}>
                          <div><strong>Tipo:</strong> {personalizacion.tipoPedal || '-'}</div>
                          <div><strong>Sonido:</strong> {(personalizacion.estiloSonido || []).join(', ') || '-'}</div>
                          <div><strong>Referencia:</strong> {personalizacion.referenciaSonido || '-'}</div>
                          <div><strong>Enclosure:</strong> {personalizacion.enclosureColor || '-'}</div>
                          <div><strong>Knobs:</strong> {personalizacion.knobColor || '-'}</div>
                          <div><strong>LED:</strong> {personalizacion.ledColor || '-'}</div>
                          <div><strong>Nombre:</strong> {personalizacion.nombrePedal || '-'}</div>
                          <div><strong>Controles:</strong> {(personalizacion.controles || []).join(', ') || '-'}</div>
                          <div><strong>Uso:</strong> {(personalizacion.usoPrincipal || []).join(', ') || '-'}</div>
                          <div><strong>Descripción:</strong> {personalizacion.descripcionUso || '-'}</div>
                          {personalizacion.referenciaArchivo && (
                            <div>
                              <strong>Referencia visual:</strong>
                              {typeof personalizacion.referenciaArchivo === 'string' && personalizacion.referenciaArchivo.startsWith('http') ? (
                                <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                  <img
                                    src={personalizacion.referenciaArchivo}
                                    alt='Referencia'
                                    style={{ width: 120, borderRadius: 8, cursor: 'zoom-in', border: '1px solid #e5e7eb' }}
                                    onClick={() => abrirImagen(personalizacion.referenciaArchivo)}
                                  />
                                  <button
                                    type='button'
                                    onClick={() => abrirImagen(personalizacion.referenciaArchivo)}
                                    style={{ padding: '8px 12px', border: 'none', borderRadius: 8, background: '#111827', color: '#fff', cursor: 'pointer' }}
                                  >
                                    Ver grande
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() => descargarImagen(personalizacion.referenciaArchivo, `referencia-${pedido._id?.substring(0, 8)}`)}
                                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff', color: '#111827', cursor: 'pointer' }}
                                  >
                                    Descargar
                                  </button>
                                </div>
                              ) : (
                                <div>{personalizacion.referenciaArchivo}</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      )}

      {imagenAmplia && (
        <div
          onClick={() => setImagenAmplia('')}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '16px',
              maxWidth: '92vw',
              maxHeight: '92vh',
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
            }}
          >
            <img
              src={imagenAmplia}
              alt='Referencia ampliada'
              style={{ maxWidth: '85vw', maxHeight: '75vh', display: 'block', borderRadius: '12px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <a
                href={imagenAmplia}
                download
                target='_blank'
                rel='noreferrer'
                style={{ padding: '10px 14px', borderRadius: 8, background: '#111827', color: '#fff', textDecoration: 'none' }}
              >
                Descargar
              </a>
              <button
                type='button'
                onClick={() => setImagenAmplia('')}
                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pedidos
