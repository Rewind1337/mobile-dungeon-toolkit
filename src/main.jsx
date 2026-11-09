import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/global.scss';
import App from './App.jsx'
import { LocalizationProvider } from './localization/LocalizationProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  </StrictMode>,
)
