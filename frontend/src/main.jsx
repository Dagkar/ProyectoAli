import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ShopContextProvider } from './context/ShopContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cargar model-viewer script
const script = document.createElement('script')
script.type = 'module'
script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
document.head.appendChild(script)

const scriptLegacy = document.createElement('script')
scriptLegacy.noModule = true
scriptLegacy.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js'
document.head.appendChild(scriptLegacy)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <App />
    </ShopContextProvider>
  </BrowserRouter>,
)
