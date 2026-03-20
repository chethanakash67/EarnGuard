import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { LanguageProvider } from './context/LanguageContext'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <LanguageProvider>
            <UserProvider>
                <App />
            </UserProvider>
        </LanguageProvider>
    </StrictMode>
)
