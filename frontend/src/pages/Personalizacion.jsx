import React, { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import '../styles/personalizacion.css'

const colorSwatch = (hex) => ({ background: `linear-gradient(135deg, ${hex}, ${hex}cc)` })

const pedalTypes = [
  'Overdrive',
  'Distortion',
  'Fuzz',
  'Boost',
  'Delay',
  'Chorus',
  'Tremolo',
  'Reverb',
  'Pedal experimental / noise',
  'No estoy seguro, quiero asesoría'
]

const soundOptions = [
  'Cálido y vintage',
  'Brillante y definido',
  'Sucio / garage',
  'Pesado / agresivo',
  'Psicodélico',
  'Transparente',
  'Experimental',
  'Inspirado en un artista'
]

const enclosureColors = [
  { label: 'Negro', hex: '#111827' },
  { label: 'Blanco', hex: '#f8fafc' },
  { label: 'Rojo', hex: '#ef4444' },
  { label: 'Azul', hex: '#2563eb' },
  { label: 'Verde', hex: '#16a34a' },
  { label: 'Plateado', hex: '#cbd5e1' },
  { label: 'Sin pintar / aluminio', hex: '#d6d3d1' },
  { label: 'Otro', hex: '#f59e0b' }
]

const knobColors = [
  { label: 'Negro', hex: '#0f172a' },
  { label: 'Blanco', hex: '#f8fafc' },
  { label: 'Crema', hex: '#fef3c7' },
  { label: 'Cromado', hex: '#e2e8f0' },
  { label: 'Transparente', hex: '#bae6fd' },
  { label: 'Otro', hex: '#a855f7' }
]

const ledColors = [
  { label: 'Blanco', hex: '#f8fafc' },
  { label: 'Rojo', hex: '#dc2626' },
  { label: 'Azul', hex: '#2563eb' },
  { label: 'Verde', hex: '#16a34a' },
  { label: 'Amarillo', hex: '#facc15' },
  { label: 'Morado', hex: '#9333ea' }
]

const complexityOptions = [
  { id: 'simple', label: 'Simple', description: '1 a 2 controles' },
  { id: 'intermedio', label: 'Intermedio', description: '3 controles' },
  { id: 'completo', label: 'Completo', description: '4 o más controles' },
  { id: 'asesoria', label: 'No sé', description: 'Recomiéndame una configuración' }
]

const useOptions = [
  'Para tocar en casa',
  'Para grabación en estudio',
  'Para tocar en vivo',
  'Para pedalboard principal',
  'Para bajo',
  'Para guitarra',
  'Para sonidos experimentales',
  'Otro'
]

const controlOptionsMap = {
  overdrive: ['Volume', 'Gain', 'Tone', 'Bias', 'Bass', 'Treble', 'Blend'],
  distortion: ['Volume', 'Gain', 'Tone', 'Bass', 'Treble', 'Blend'],
  fuzz: ['Volume', 'Fuzz', 'Tone', 'Bias', 'Level', 'Gate'],
  boost: ['Volume', 'Gain', 'Tone', 'Clean Blend'],
  delay: ['Time', 'Feedback', 'Mix', 'Modulation', 'Tap tempo'],
  chorus: ['Depth', 'Rate', 'Mix', 'Tone'],
  tremolo: ['Rate', 'Depth', 'Shape', 'Volume'],
  reverb: ['Mix', 'Decay', 'Tone', 'Pre-delay'],
  default: ['Volume', 'Gain', 'Tone']
}

const typePriceMap = {
  Boost: 1050,
  Fuzz: 1300,
  Overdrive: 1550,
  Distortion: 1650,
  Tremolo: 1900,
  Chorus: 2700,
  Delay: 2900,
  Reverb: 3500,
  'Pedal experimental / noise': 3000,
  'No estoy seguro, quiero asesoría': 0
}

const complexityPriceMap = {
  simple: 0,
  intermedio: 500,
  completo: 1200,
  asesoria: 0
}

const usePriceMap = {
  'Para tocar en casa': 0,
  'Para grabación en estudio': 120,
  'Para tocar en vivo': 180,
  'Para pedalboard principal': 150,
  'Para bajo': 150,
  'Para guitarra': 0,
  'Para sonidos experimentales': 250,
  Otro: 120
}

const calculatePersonalizationPrice = (data) => {
  const tipoPedal = data.tipoPedal || ''
  const estiloSonido = Array.isArray(data.estiloSonido) ? data.estiloSonido : []
  const controles = Array.isArray(data.controles) ? data.controles : []
  const usoPrincipal = Array.isArray(data.usoPrincipalSeleccion) && data.usoPrincipalSeleccion.length > 0
    ? data.usoPrincipalSeleccion
    : Array.isArray(data.usoPrincipal)
      ? data.usoPrincipal
      : []

  const enclosureColor = data.enclosureColorSeleccion || data.enclosureColor || ''
  const knobColor = data.knobColorSeleccion || data.knobColor || ''
  const ledColor = data.ledColorSeleccion || data.ledColor || ''

  const tipoExtra = typePriceMap[tipoPedal] || 0
  const sonidoExtra = estiloSonido.reduce((sum, option) => {
    if (option === 'Psicodélico') return sum + 300
    if (option === 'Transparente') return sum + 200
    if (option === 'Experimental') return sum + 600
    if (option === 'Inspirado en un artista') return sum + 550
    return sum
  }, 0)
  const complejidadExtra = complexityPriceMap[data.complejidad] || 0
  const controlesExtra = controles.reduce((sum, control) => {
    const controlPriceMap = {
      Bass: 175,
      Treble: 175,
      Bias: 225,
      Blend: 350,
      Mix: 350,
      Feedback: 400,
      Depth: 250,
      Rate: 250,
      Shape: 275,
      'Pre-delay': 500,
      'Tap tempo': 850,
      'Clean Blend': 350,
      Gate: 175,
      Modulation: 175,
      Time: 0,
      Volume: 0,
      Gain: 0,
      Tone: 0,
      Fuzz: 0,
      Level: 0
    }
    return sum + (controlPriceMap[control] || 125)
  }, 0)
  const enclosureExtra = enclosureColor && ['Negro', 'Blanco', 'Plateado', 'Sin pintar / aluminio'].includes(enclosureColor) ? 0 : (enclosureColor ? 250 : 0)
  const knobExtra = knobColor && ['Negro', 'Blanco', 'Crema'].includes(knobColor) ? 0 : (knobColor ? 120 : 0)
  const ledExtra = ledColor && ['Rojo', 'Azul', 'Verde', 'Blanco', 'Amarillo'].includes(ledColor) ? 0 : (ledColor ? 75 : 0)
  const usoExtra = usoPrincipal.reduce((sum, option) => sum + (usePriceMap[option] ?? 120), 0)

  return tipoExtra + sonidoExtra + complejidadExtra + controlesExtra + enclosureExtra + knobExtra + ledExtra + usoExtra
}

const Personalizacion = () => {
  const navigate = useNavigate()
  const { addCustomItem, token, backendUrl } = useContext(ShopContext)
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [referenciaFile, setReferenciaFile] = useState(null)
  const [referenciaFileUrl, setReferenciaFileUrl] = useState('')
  const [subiendoReferencia, setSubiendoReferencia] = useState(false)
  const [form, setForm] = useState({
    tipoPedal: '',
    estiloSonido: [],
    referenciaSonido: '',
    enclosureColor: '',
    enclosureOther: '',
    knobColor: '',
    knobOther: '',
    ledColor: '',
    nombrePedal: '',
    complejidad: '',
    controles: [],
    usoPrincipal: [],
    usoOtro: '',
      descripcionUso: ''
  })

  const totalSteps = 5

  const controlsForType = useMemo(() => {
    const key = (form.tipoPedal || '').toLowerCase()
    return controlOptionsMap[key] || controlOptionsMap.default
  }, [form.tipoPedal])

  const toggleMulti = (field, value) => {
    setForm(prev => {
      const current = prev[field]
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter(item => item !== value)
          : [...current, value]
      }
    })
  }

  const setValue = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0] || null
    setReferenciaFile(file)
    if (!file) return

    try {
      setSubiendoReferencia(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${backendUrl}/api/uploads`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'No se pudo subir la imagen')
      }

      setReferenciaFileUrl(data.url || '')
      toast.success('Imagen de referencia lista')
    } catch (error) {
      console.error('Error subiendo imagen de referencia:', error)
      setReferenciaFile(null)
      setReferenciaFileUrl('')
      toast.error(error.message || 'No se pudo subir la imagen')
    } finally {
      setSubiendoReferencia(false)
    }
  }

  const handleRemoveReferenceImage = () => {
    setReferenciaFile(null)
    setReferenciaFileUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.info('Imagen de referencia eliminada')
  }

  const validateCurrentStep = () => {
    if (step === 1 && !form.tipoPedal) {
      toast.error('Selecciona un tipo de pedal')
      return false
    }

    if (step === 2 && form.estiloSonido.length === 0) {
      toast.error('Selecciona al menos un carácter de sonido')
      return false
    }

    if (step === 3 && !form.enclosureColor) {
      toast.error('Selecciona un color de enclosure')
      return false
    }

    if (step === 3 && !referenciaFileUrl) {
      toast.error('Sube una imagen de referencia')
      return false
    }

    if (step === 4 && !form.complejidad) {
      toast.error('Selecciona el nivel de controles')
      return false
    }

    if (step === 5 && form.usoPrincipal.length === 0) {
      toast.error('Selecciona al menos un uso principal')
      return false
    }

    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return
    setStep(prev => Math.min(totalSteps, prev + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const buildSummary = () => {
    return {
      tipoPedal: form.tipoPedal,
      estiloSonido: form.estiloSonido,
      referenciaSonido: form.referenciaSonido,
      enclosureColorSeleccion: form.enclosureColor,
      enclosureColor: form.enclosureColor === 'Otro' ? form.enclosureOther || 'Otro' : form.enclosureColor,
      knobColorSeleccion: form.knobColor,
      knobColor: form.knobColor === 'Otro' ? form.knobOther || 'Otro' : form.knobColor,
      ledColorSeleccion: form.ledColor,
      ledColor: form.ledColor,
      nombrePedal: form.nombrePedal,
      complejidad: form.complejidad,
      controles: form.controles,
      usoPrincipalSeleccion: form.usoPrincipal,
      usoPrincipal: form.usoPrincipal.includes('Otro') && form.usoOtro
        ? [...form.usoPrincipal.filter(item => item !== 'Otro'), form.usoOtro]
        : form.usoPrincipal,
      descripcionUso: form.descripcionUso,
      referenciaArchivo: referenciaFileUrl || (referenciaFile ? referenciaFile.name : '')
    }
  }

  const handleSubmit = () => {
    if (!token) {
      toast.error('Debes iniciar sesión para guardar tu personalización')
      navigate('/login')
      return
    }

    const summary = buildSummary()
    const label = summary.nombrePedal?.trim() || summary.tipoPedal || 'Pedido personalizado'
    const precioPersonalizacion = calculatePersonalizationPrice(form)

    if (subiendoReferencia) {
      toast.info('Espera a que termine de subir la imagen')
      return
    }

    if (!referenciaFileUrl) {
      toast.error('Debes subir una imagen de referencia')
      return
    }

    addCustomItem({
      nombre: `Personalización: ${label}`,
      imagen: referenciaFileUrl || '/img/Logo.png',
      precio: precioPersonalizacion,
      personalizacion: { ...summary, referenciaArchivo: referenciaFileUrl || summary.referenciaArchivo }
    })

    setTimeout(() => navigate('/carrito'), 0)
  }

  return (
    <div className='personalizacion-page'>
      <section className='about-hero personalizacion-hero'>
        <div className='banner-content'>
          <h1>Personaliza tu pedal</h1>
          <p className='banner-subtitle'>
            Selecciona el circuito, el carácter del sonido, la estética y la configuración general.
          </p>
        </div>
      </section>

      <div className='progress-shell'>
        <div className='progress-header'>
          <span>Paso {step} de {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className='progress-track'>
          <div className='progress-fill' style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className='personalizacion-card'>
        {step === 1 && (
          <section>
            <h2>1. Tipo de pedal / circuito base</h2>
            <p className='section-copy'>Elige una base clara para mantener la solicitud controlada.</p>
            <div className='option-grid option-grid-large'>
              {pedalTypes.map(option => (
                <button
                  key={option}
                  type='button'
                  className={`choice-card ${form.tipoPedal === option ? 'active' : ''}`}
                  onClick={() => setValue('tipoPedal', option)}
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2>2. Estilo de sonido deseado</h2>
            <p className='section-copy'>Selecciona uno o varios caracteres de sonido y añade una referencia libre.</p>
            <div className='option-grid'>
              {soundOptions.map(option => (
                <button
                  key={option}
                  type='button'
                  className={`choice-card ${form.estiloSonido.includes(option) ? 'active' : ''}`}
                  onClick={() => toggleMulti('estiloSonido', option)}
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>

            <div className='field-block'>
              <label>Referencia de sonido, artista, canción o pedal similar</label>
              <textarea
                rows='4'
                placeholder='Ejemplo: Frusciante, Hendrix, shoegaze, Arctic Monkeys, etc.'
                value={form.referenciaSonido}
                onChange={(e) => setValue('referenciaSonido', e.target.value)}
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2>3. Diseño visual del pedal</h2>
            <div className='field-block'>
              <label>Color del enclosure</label>
              <div className='swatch-grid'>
                {enclosureColors.map(color => (
                  <button
                    key={color.label}
                    type='button'
                    className={`swatch-card ${form.enclosureColor === color.label ? 'active' : ''}`}
                    style={colorSwatch(color.hex)}
                    onClick={() => setValue('enclosureColor', color.label)}
                  >
                    <span>{color.label}</span>
                  </button>
                ))}
              </div>
              {form.enclosureColor === 'Otro' && (
                <input
                  type='text'
                  placeholder='Describe el color del enclosure'
                  value={form.enclosureOther}
                  onChange={(e) => setValue('enclosureOther', e.target.value)}
                />
              )}
            </div>

            <div className='field-block'>
              <label>Color de knobs</label>
              <div className='swatch-grid'>
                {knobColors.map(color => (
                  <button
                    key={color.label}
                    type='button'
                    className={`swatch-card ${form.knobColor === color.label ? 'active' : ''}`}
                    style={colorSwatch(color.hex)}
                    onClick={() => setValue('knobColor', color.label)}
                  >
                    <span>{color.label}</span>
                  </button>
                ))}
              </div>
              {form.knobColor === 'Otro' && (
                <input
                  type='text'
                  placeholder='Describe el color de los knobs'
                  value={form.knobOther}
                  onChange={(e) => setValue('knobOther', e.target.value)}
                />
              )}
            </div>

            <div className='field-block'>
              <label>Color del LED</label>
              <div className='swatch-grid led-grid'>
                {ledColors.map(color => (
                  <button
                    key={color.label}
                    type='button'
                    className={`swatch-card led-card ${form.ledColor === color.label ? 'active' : ''}`}
                    style={colorSwatch(color.hex)}
                    onClick={() => setValue('ledColor', color.label)}
                  >
                    <span>{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className='field-block'>
              <label>Nombre del pedal</label>
              <input
                type='text'
                placeholder='Ejemplo: Tone Forge'
                value={form.nombrePedal}
                onChange={(e) => setValue('nombrePedal', e.target.value)}
              />
            </div>

            <div className='field-block'>
              <label>Sube una imagen de referencia</label>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                hidden
                onChange={handleFileChange}
              />
              <button type='button' className='upload-btn' onClick={() => fileInputRef.current?.click()}>
                {subiendoReferencia ? 'Subiendo...' : 'Seleccionar archivo'}
              </button>
              {referenciaFile && <span className='file-chip'>{referenciaFile.name}</span>}
              {referenciaFileUrl && (
                <button type='button' className='ghost-btn' onClick={handleRemoveReferenceImage}>
                  Quitar imagen
                </button>
              )}
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2>4. Controles del pedal</h2>
            <p className='section-copy'>Elige qué tan simple o completo lo quieres y luego selecciona los controles recomendados.</p>

            <div className='option-grid option-grid-large'>
              {complexityOptions.map(option => (
                <button
                  key={option.id}
                  type='button'
                  className={`choice-card ${form.complejidad === option.id ? 'active' : ''}`}
                  onClick={() => setValue('complejidad', option.id)}
                >
                  <span>{option.label}</span>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>

            <div className='field-block'>
              <label>Controles sugeridos según el tipo de pedal</label>
              <div className='option-grid'>
                {controlsForType.map(control => (
                  <button
                    key={control}
                    type='button'
                    className={`choice-card ${form.controles.includes(control) ? 'active' : ''}`}
                    onClick={() => toggleMulti('controles', control)}
                  >
                    <span>{control}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2>5. Uso principal del pedal</h2>
            <p className='section-copy'>Cuéntanos el contexto real para afinar la propuesta.</p>

            <div className='option-grid'>
              {useOptions.map(option => (
                <button
                  key={option}
                  type='button'
                  className={`choice-card ${form.usoPrincipal.includes(option) ? 'active' : ''}`}
                  onClick={() => toggleMulti('usoPrincipal', option)}
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>

            {form.usoPrincipal.includes('Otro') && (
              <div className='field-block'>
                <label>Especifica otro uso</label>
                <input
                  type='text'
                  placeholder='Describe el uso principal'
                  value={form.usoOtro}
                  onChange={(e) => setValue('usoOtro', e.target.value)}
                />
              </div>
            )}

            <div className='field-block'>
              <label>Cuéntanos brevemente qué necesitas que haga este pedal</label>
              <textarea
                rows='5'
                placeholder='Describe el sonido, la respuesta y cualquier detalle útil para la cotización.'
                value={form.descripcionUso}
                onChange={(e) => setValue('descripcionUso', e.target.value)}
              />
            </div>

            <div className='field-block'>
              <label>Cotización estimada</label>
              <div style={{ marginTop: '8px', fontSize: '1.4rem', fontWeight: 800 }}>
                ${calculatePersonalizationPrice(form).toLocaleString('en-US')}
              </div>
              <small style={{ color: '#999', marginTop: '8px', display: 'block' }}>
                El precio se calcula automáticamente según las características seleccionadas.
              </small>
            </div>
          </section>
        )}

        <div className='step-actions'>
          <button type='button' className='ghost-btn' onClick={handlePrev} disabled={step === 1}>
            Anterior
          </button>
          {step < totalSteps ? (
            <button type='button' className='primary-btn' onClick={handleNext}>
              Siguiente
            </button>
          ) : (
            <button type='button' className='primary-btn' onClick={handleSubmit}>
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Personalizacion
