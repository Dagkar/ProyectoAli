import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import Pago from './pages/Pago'
import Historial from './pages/Historial'
import Login from './pages/Login'
import Registro from './pages/Registro'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Asistente from './pages/Asistente'
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo-pedales" element={<Catalogo tipo="pedales" />} />
          <Route path="/catalogo-accesorios" element={<Catalogo tipo="accesorios" />} />
          <Route path="/catalogo-servicios" element={<Catalogo tipo="servicios" />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/ayuda" element={<FAQ />} />
          <Route path="/asistente" element={<Asistente />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
