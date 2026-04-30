import React from 'react'
import '../styles/footer.css'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/img/Logo.png" alt="ATONE" className="footer-logo" />
        <p>Pedales, accesorios y servicios para guitarristas que buscan buen tono y atención real.</p>
      </div>

      <div className="footer-links">
        <h4>Explorar</h4>
        <a href="/">Inicio</a>
        <a href="/catalogo-pedales">Pedales</a>
        <a href="/catalogo-servicios">Servicios</a>
        <a href="/catalogo-accesorios">Artículos</a>
      </div>

      <div className="footer-contact">
        <h4>Contacto</h4>
        <p>atone.services.mx@gmail.com</p>
        <p>+52 55 4052 3234</p>
        <p>Ciudad de México, México</p>
      </div>

      <div className="footer-social">
        <h4>Redes</h4>
        <div className="footer-social-links">
          <a href="https://www.facebook.com/ali.nunez.291681" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.instagram.com/alien1g3n4_/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@alien1g3n4?lang=es-419" target="_blank" rel="noreferrer">TikTok</a>
        </div>
      </div>

      <div className="footer-copy">
        <p>© 2026 ATONE. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
