import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Providers from './app/providers.jsx'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './features/auth/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Providers>
    </BrowserRouter>
  </StrictMode>
)
