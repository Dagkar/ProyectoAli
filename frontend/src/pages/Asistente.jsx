import React from 'react'
import '../styles/pages.css'

const EMBED_CONTAINER_ID = 'bp-embedded-webchat'

const Asistente = () => {
  return (
    <div className="asistente-page">
      <section className="atone-banner atone-banner--full">
        <div className="banner-content">
          <h1>Asistente A. Tone</h1>
          <p className="banner-subtitle">Tu asesor musical especializado en pedales, accesorios y servicios para guitarra y bajo</p>
        </div>
      </section>

      <div className="asistente-content" style={{ padding: '0 20px', marginBottom: '40px' }}>
        <div
          id={EMBED_CONTAINER_ID}
          style={{
            width: '100%',
            maxWidth: '1200px',
            height: '75vh',
            margin: '0 auto',
            border: '2px solid #ff8a00',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
          }}
        />
      </div>
    </div>
  )
}

export default Asistente
