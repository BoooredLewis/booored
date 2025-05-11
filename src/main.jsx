import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Mockup from './mockup.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Mockup />
  </StrictMode>,
)
