import { useState } from 'react'
import InputForm from './components/InputForm'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'
import { ShieldIcon, AlertTriangleIcon } from './components/Icons'

export default function App() {
    const [view, setView] = useState('form') // 'form' | 'loading' | 'dashboard'
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')

    const handleSubmit = async (formData) => {
        setError('')
        setView('loading')

        try {
            const res = await fetch('/api/assess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong')
            }

            // Hold loading screen for at least 2s for effect
            await new Promise((r) => setTimeout(r, 2000))

            setResult(data)
            setView('dashboard')
        } catch (err) {
            setError(err.message)
            setView('form')
        }
    }

    const handleReset = () => {
        setResult(null)
        setView('form')
    }

    return (
        <div className="app-container">
            {/* Header */}
            <header className="app-header">
                <span className="app-header__icon"><ShieldIcon size={48} /></span>
                <h1 className="app-header__title">EarnGuard</h1>
                <p className="app-header__subtitle">
                    AI-powered income protection for gig workers
                </p>
            </header>

            {/* Error */}
            {error && (
                <div className="status-banner status-banner--protected" style={{ marginBottom: 24, borderColor: 'rgba(255,69,58,0.2)', background: 'rgba(255,69,58,0.08)' }}>
                    <span className="status-banner__icon"><AlertTriangleIcon size={24} /></span>
                    <p className="status-banner__text" style={{ color: 'var(--red)' }}>{error}</p>
                </div>
            )}

            {/* Views */}
            {view === 'form' && <InputForm onSubmit={handleSubmit} />}
            {view === 'loading' && <LoadingScreen />}
            {view === 'dashboard' && <Dashboard data={result} onReset={handleReset} />}

            {/* Footer */}
            <footer className="app-footer">
                <p className="app-footer__text">EarnGuard &copy; {new Date().getFullYear()} &middot; Simulated Demo</p>
            </footer>
        </div>
    )
}
