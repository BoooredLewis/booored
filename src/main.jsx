import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app.jsx'
import Underconstrction from './UnderConstruction.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Underconstrction />
  </StrictMode>,
)
