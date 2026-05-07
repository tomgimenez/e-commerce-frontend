import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LoreVaultApp } from './LoreVaultApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoreVaultApp />
  </StrictMode>,
)
