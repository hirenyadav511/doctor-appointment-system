import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'

import ThemeContextProvider from './context/ThemeContext.jsx'

import { ClerkProvider } from '@clerk/clerk-react'

// Import your publishable key (trim to avoid malformed URLs / ERR_NAME_NOT_RESOLVED)
const PUBLISHABLE_KEY =
  typeof import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === "string"
    ? import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim()
    : ""

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to frontend/.env")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ThemeContextProvider>
    </ClerkProvider>
  </BrowserRouter>,
)
