import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider'

if (import.meta.env.DEV) {
  document.documentElement.setAttribute(
    'data-env-dev', 'true'
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
