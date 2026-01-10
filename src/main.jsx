import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import FuturisticPage from './components/Futuristic/FuturisticPage.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <FuturisticPage />
    </ErrorBoundary>
  </StrictMode>,
)
