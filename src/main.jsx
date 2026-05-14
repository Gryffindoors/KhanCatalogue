import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, HashRouter } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { UIProvider } from './context/UIContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UIProvider>
        <App />
        <Toaster position="top-center" />
      </UIProvider>
    </BrowserRouter>
  </StrictMode>
)
