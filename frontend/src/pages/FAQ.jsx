import React, { useState } from 'react'
import '../styles/pages.css'

const FAQ = () => {
  const [expandedId, setExpandedId] = useState(null)

  const faqs = [
    {
      id: 1,
      pregunta: '¿Cuál es la garantía de los productos?',
      respuesta: 'Todos nuestros productos vienen con garantía completa del fabricante, que generalmente es de 1 a 3 años según el modelo. Además, ofrecemos garantía de satisfacción de 30 días en caso de que el producto no cumpla con tus expectativas.'
    },
    {
      id: 2,
      pregunta: '¿Cuánto tiempo tarda la entrega?',
      respuesta: 'Entregamos en toda la región en 2-5 días hábiles, dependiendo de tu ubicación. Para pedidos urgentes, contamos con servicio express de entrega en 24 horas. El costo de envío se calcula durante el checkout.'
    },
    {
      id: 3,
      pregunta: '¿Puedo devolver un producto si no me gusta?',
      respuesta: 'Sí, contamos con una política de devolución de 30 días. Si el producto no cumple con tus expectativas o viene defectuoso, puedes devolverlo para obtener un reembolso completo o un cambio por otro producto.'
    },
    {
      id: 4,
      pregunta: '¿Ofrecen servicio técnico?',
      respuesta: 'Sí, contamos con servicio técnico especializado. Ofrecemos reparación, configuración, afinación y mantenimiento de pedales y guitarras. Contacta a nuestro equipo para presupuesto.'
    },
    {
      id: 5,
      pregunta: '¿Cuáles son los métodos de pago?',
      respuesta: 'Aceptamos tarjetas de crédito y débito, transferencias bancarias, billeteras digitales y efectivo en sucursal. Todos los pagos son procesados de forma segura con encriptación SSL.'
    },
    {
      id: 6,
      pregunta: '¿Necesito crear una cuenta para comprar?',
      respuesta: 'No es obligatorio, puedes realizar compras como invitado. Sin embargo, crear una cuenta te permite guardar tus datos, ver tu historial de pedidos y acceder a ofertas exclusivas.'
    },
    {
      id: 7,
      pregunta: '¿Hacen descuentos por cantidad?',
      respuesta: 'Sí, contamos con descuentos especiales para compras en volumen. Contacta a nuestro equipo de ventas para cotizaciones personalizadas si necesitas múltiples unidades.'
    },
    {
      id: 8,
      pregunta: '¿Puedo cambiar mi pedido después de realizarlo?',
      respuesta: 'Si el pedido aún no ha sido procesado (dentro de 2 horas de realizado), podemos modificarlo sin costo. Después de ese tiempo, necesitarás contactar con soporte para solicitar cambios.'
    },
    {
      id: 9,
      pregunta: '¿Cómo sé si un pedal es compatible con mi guitarra?',
      respuesta: 'La mayoría de pedales funcionan con cualquier guitarra eléctrica o acústica-eléctrica. Ofrecemos asesoría gratuita - contáctanos con detalles de tu instrumento y te ayudaremos a elegir.'
    },
    {
      id: 10,
      pregunta: '¿Ofrecen asesoría para elegir pedales?',
      respuesta: 'Absolutamente. Nuestro equipo de expertos está disponible 24/7 para ayudarte. Podemos aconsejar basándonos en tu género musical, presupuesto y necesidades específicas.'
    },
    {
      id: 11,
      pregunta: '¿Tienen tienda física?',
      respuesta: 'Sí, contamos con una tienda física en el centro de la ciudad donde puedes probar nuestros productos. Puedes visitarnos en horario comercial: Lunes a Viernes 10:00-19:00, Sábado 10:00-17:00.'
    },
    {
      id: 12,
      pregunta: '¿Qué hacer si mi pedal llega dañado?',
      respuesta: 'Contáctanos inmediatamente con fotos del daño. Nos hacemos cargo del envío de reemplazo y puedes devolver el producto dañado sin costo. Procesamos reemplazos dentro de 24-48 horas.'
    }
  ]

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="faq-content">
          <h1>Preguntas Frecuentes</h1>
          <p className="lead">Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-list">
            {faqs.map((faq) => (
              <div key={faq.id} className="faq-item">
                <button
                  className={`faq-pregunta ${expandedId === faq.id ? 'expanded' : ''}`}
                  onClick={() => toggleExpanded(faq.id)}
                >
                  <span className="faq-numero">{String(faq.id).padStart(2, '0')}</span>
                  <span className="faq-text">{faq.pregunta}</span>
                  <span className="faq-icon">
                    {expandedId === faq.id ? '−' : '+'}
                  </span>
                </button>
                {expandedId === faq.id && (
                  <div className="faq-respuesta">
                    <p>{faq.respuesta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <aside className="faq-sidebar">
            <div className="contact-card">
              <h3>¿No encontraste tu respuesta?</h3>
              <p>Contáctanos directamente y nuestro equipo estará feliz de ayudarte.</p>
              
              <div className="contact-methods">
                <div className="method">
                  <strong>📧 Email</strong>
                  <p>info@atone.com</p>
                </div>
                <div className="method">
                  <strong>📱 Teléfono</strong>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="method">
                  <strong>💬 Chat</strong>
                  <p>Disponible 24/7</p>
                </div>
                <div className="method">
                  <strong>📍 Visitanos</strong>
                  <p>Centro de la ciudad</p>
                </div>
              </div>
            </div>

            <div className="help-card">
              <h3>Categorías de Ayuda</h3>
              <ul>
                <li><a href="#pedidos">Sobre Pedidos</a></li>
                <li><a href="#pagos">Métodos de Pago</a></li>
                <li><a href="#devoluciones">Devoluciones</a></li>
                <li><a href="#producto">Sobre Productos</a></li>
                <li><a href="#envios">Envíos</a></li>
                <li><a href="#tecnico">Servicio Técnico</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="faq-stats">
        <div className="stat">
          <h4>12+</h4>
          <p>Preguntas Frecuentes</p>
        </div>
        <div className="stat">
          <h4>24/7</h4>
          <p>Atención al Cliente</p>
        </div>
        <div className="stat">
          <h4>98%</h4>
          <p>Clientes Satisfechos</p>
        </div>
        <div className="stat">
          <h4>2-5 días</h4>
          <p>Entrega Promedio</p>
        </div>
      </section>
    </div>
  )
}

export default FAQ
