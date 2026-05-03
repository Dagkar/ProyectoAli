import React from 'react'
import '../styles/pages.css'

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-content">
          <h1>Nosotros</h1>
          <p className="lead">MaRAI Somos ATONE - Tu tienda especializada en pedales de efectos y accesorios musicales de calidad</p>
        </div>
      </section>

      <section className="about-history">
        <h2>Nuestra Historia</h2>
        <div className="history-content">
          <p>
            ATONE nace en 2018 como una tienda especializada en pedales de efectos para guitarristas y músicos profesionales.
            Lo que comenzó como un pequeño emprendimiento de dos apasionados por la música, hoy es una tienda de referencia
            en la región para todo lo relacionado con equipos de efectos de audio.
          </p>
          
          <h3>Misión</h3>
          <p>
            Proporcionar a músicos y profesionales de audio los mejores pedales de efectos y accesorios, con garantía de calidad
            y un servicio técnico experto. Nos esforzamos por ser el puente entre músicos y tecnología de audio de excelencia.
          </p>

          <h3>Visión</h3>
          <p>
            Ser la tienda líder en pedales de efectos en toda la región, reconocida por nuestra calidad, servicio técnico
            y compromiso con la satisfacción del cliente. Queremos que cada músico encuentre exactamente lo que necesita
            para expresar su creatividad sonora.
          </p>

          <h3>Valores</h3>
          <ul className="values-list">
            <li><strong>Calidad:</strong> Solo vendemos productos de marcas reconocidas y garantizados</li>
            <li><strong>Honestidad:</strong> Consejos sinceros sin presión de ventas</li>
            <li><strong>Servicio:</strong> Atención técnica especializada 24/7</li>
            <li><strong>Pasión:</strong> Amamos la música y queremos que tú también disfrutes tu instrumento</li>
            <li><strong>Experiencia:</strong> Nuestro equipo tiene más de 15 años en la industria</li>
          </ul>

          <h3>¿Por Qué Elegirnos?</h3>
          <div className="why-choose-grid">
            <div className="why-item">
              <h4>✓ Calidad Garantizada</h4>
              <p>Todos nuestros productos son originales y vienen con garantía completa del fabricante</p>
            </div>
            <div className="why-item">
              <h4>✓ Expertos en Pedales</h4>
              <p>Nuestro equipo está capacitado para asesorarte sobre el pedal perfecto para tu necesidad</p>
            </div>
            <div className="why-item">
              <h4>✓ Servicio Técnico</h4>
              <p>Reparación, configuración y mantenimiento de pedales y equipos de audio</p>
            </div>
            <div className="why-item">
              <h4>✓ Envíos Rápidos</h4>
              <p>Entrega a domicilio en toda la región con embalaje profesional</p>
            </div>
            <div className="why-item">
              <h4>✓ Mejores Precios</h4>
              <p>Trabajamos directamente con fabricantes para oferte los mejores precios</p>
            </div>
            <div className="why-item">
              <h4>✓ Soporte 24/7</h4>
              <p>Equipo disponible para resolver tus dudas en cualquier momento</p>
            </div>
          </div>

          <h3>Nuestro Equipo</h3>
          <p>
            Contamos con un equipo de profesionales especializados en música y tecnología de audio.
            Cada miembro del equipo es un músico apasionado con años de experiencia técnica.
            Estamos aquí para ayudarte a encontrar el equipo perfecto y resolver cualquier duda técnica.
          </p>

          <h3>Ubicación</h3>
          <p>
            Nos encontramos en el corazón de la ciudad, con una tienda física donde puedes probar
            nuestros productos antes de comprar. También contamos con servicio de entrega a domicilio
            en toda la región para tu conveniencia.
          </p>

          <div className="contact-info">
            <h3>Contacto</h3>
            <p><strong>Email:</strong> info@atone.com</p>
            <p><strong>Teléfono:</strong> +1 (555) 123-4567</p>
            <p><strong>Horario:</strong> Lunes a Viernes: 10:00 - 19:00 | Sábado: 10:00 - 17:00</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
