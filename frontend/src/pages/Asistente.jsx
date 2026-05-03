import React, { useEffect } from 'react'
import '../styles/pages.css'

const EMBED_CONTAINER_ID = 'bp-embedded-webchat'
const BOTPRESS_INJECT_SRC = 'https://cdn.botpress.cloud/webchat/v3.6/inject.js'
const BOTPRESS_BOT_SRC = 'https://files.bpcontent.cloud/2026/04/30/08/20260430080039-TDRP6TRK.js'

const Asistente = () => {
  useEffect(() => {
    let injectScript = document.getElementById('bp-webchat-inject')
    if (!injectScript) {
      injectScript = document.createElement('script')
      injectScript.id = 'bp-webchat-inject'
      injectScript.src = BOTPRESS_INJECT_SRC
      document.body.appendChild(injectScript)
    }

    let botScript = document.getElementById('bp-webchat-bot')
    if (!botScript) {
      botScript = document.createElement('script')
      botScript.id = 'bp-webchat-bot'
      botScript.src = BOTPRESS_BOT_SRC
      botScript.defer = true
      document.body.appendChild(botScript)
    }
  }, [])

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
