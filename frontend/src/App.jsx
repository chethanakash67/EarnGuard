import { useState, useEffect } from 'react'
import { t } from './i18n'
import Onboarding from './components/Onboarding'
import InputForm from './components/InputForm'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'
import EarningsChart from './components/EarningsChart'
import Forecast from './components/Forecast'
import AIReport from './components/AIReport'
import StreakBadge from './components/StreakBadge'
import WeatherMap from './components/WeatherMap'
import AIChatAssistant from './components/AIChatAssistant'
import AutoDemo from './components/AutoDemo'
import LanguageSwitcher from './components/LanguageSwitcher'
import { ShieldIcon, AlertTriangleIcon } from './components/Icons'

export default function App() {
    // Language
    const [lang, setLang] = useState(() => localStorage.getItem('eg_lang') || 'en')

    // Onboarding
    const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('eg_onboarded'))
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('eg_user')
        return saved ? JSON.parse(saved) : null
    })

    // Views
    const [view, setView] = useState('form') // form | loading | dashboard | demo
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')

    // Extra data for dashboard
    const [historyData, setHistoryData] = useState(null)
    const [forecastData, setForecastData] = useState(null)
    const [reportData, setReportData] = useState(null)

    // Demo form data (for auto-demo)
    const [demoFormData, setDemoFormData] = useState(null)

    // Persist language
    useEffect(() => {
        localStorage.setItem('eg_lang', lang)
    }, [lang])

    // Onboarding complete
    const handleOnboardingComplete = (data) => {
        setUserData(data)
        setOnboarded(true)
        localStorage.setItem('eg_onboarded', 'true')
        localStorage.setItem('eg_user', JSON.stringify(data))
    }

    // Form submit
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
            if (!res.ok) throw new Error(data.error || 'Something went wrong')

            // Fire parallel requests for extra data
            const [histRes, foreRes, repRes] = await Promise.all([
                fetch('/api/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        expected_income: formData.expected_income,
                        job_type: formData.job_type,
                        tier: formData.tier,
                    }),
                }),
                fetch('/api/forecast', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        expected_income: formData.expected_income,
                        job_type: formData.job_type,
                        tier: formData.tier,
                    }),
                }),
                fetch('/api/report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        expected_income: formData.expected_income,
                        job_type: formData.job_type,
                        tier: formData.tier,
                    }),
                }),
            ])

            const [hist, fore, rep] = await Promise.all([
                histRes.json(),
                foreRes.json(),
                repRes.json(),
            ])

            // Hold loading for effect
            await new Promise((r) => setTimeout(r, 2000))

            setResult(data)
            setHistoryData(hist)
            setForecastData(fore)
            setReportData(rep)
            setView('dashboard')
        } catch (err) {
            setError(err.message)
            setView('form')
        }
    }

    const handleReset = () => {
        setResult(null)
        setHistoryData(null)
        setForecastData(null)
        setReportData(null)
        setView('form')
    }

    const handleDemo = (formData) => {
        setDemoFormData(formData)
        setView('demo')
    }

    const handleDemoClose = () => {
        setDemoFormData(null)
        setView('form')
    }

    // Show onboarding
    if (!onboarded) {
        return (
            <div className="app-container">
                <LanguageSwitcher lang={lang} onLangChange={setLang} />
                <header className="app-header">
                    <span className="app-header__icon"><ShieldIcon size={48} /></span>
                    <h1 className="app-header__title">{t('appTitle', lang)}</h1>
                    <p className="app-header__subtitle">{t('appSubtitle', lang)}</p>
                </header>
                <Onboarding onComplete={handleOnboardingComplete} lang={lang} />
            </div>
        )
    }

    // Show auto-demo
    if (view === 'demo' && demoFormData) {
        return (
            <div className="app-container app-container--wide">
                <LanguageSwitcher lang={lang} onLangChange={setLang} />
                <header className="app-header app-header--compact">
                    <span className="app-header__icon"><ShieldIcon size={32} /></span>
                    <h1 className="app-header__title" style={{ fontSize: '1.5rem' }}>{t('appTitle', lang)}</h1>
                </header>
                <AutoDemo formData={demoFormData} lang={lang} onClose={handleDemoClose} />
                <AIChatAssistant lang={lang} />
            </div>
        )
    }

    return (
        <div className="app-container app-container--wide">
            <LanguageSwitcher lang={lang} onLangChange={setLang} />

            {/* Header */}
            <header className="app-header">
                <span className="app-header__icon"><ShieldIcon size={48} /></span>
                <h1 className="app-header__title">{t('appTitle', lang)}</h1>
                <p className="app-header__subtitle">{t('appSubtitle', lang)}</p>
            </header>

            {/* Error */}
            {error && (
                <div className="status-banner status-banner--protected" style={{ marginBottom: 24, borderColor: 'rgba(255,69,58,0.2)', background: 'rgba(255,69,58,0.08)' }}>
                    <span className="status-banner__icon"><AlertTriangleIcon size={24} /></span>
                    <p className="status-banner__text" style={{ color: 'var(--red)' }}>{error}</p>
                </div>
            )}

            {/* Loading */}
            {view === 'loading' && <LoadingScreen />}

            {/* Form */}
            {view === 'form' && (
                <InputForm
                    onSubmit={handleSubmit}
                    onDemo={handleDemo}
                    lang={lang}
                    defaultData={userData || {}}
                />
            )}

            {/* Dashboard with extras */}
            {view === 'dashboard' && result && (
                <>
                    {/* Streak */}
                    {historyData && (
                        <StreakBadge streak={historyData.streak} lang={lang} />
                    )}

                    <Dashboard data={result} onReset={handleReset} lang={lang} />

                    {/* Earnings Chart */}
                    <EarningsChart data={historyData} lang={lang} />

                    {/* 5-Day Forecast */}
                    <Forecast data={forecastData} lang={lang} />

                    {/* AI Report */}
                    <AIReport data={reportData} lang={lang} />

                    {/* Weather Map */}
                    <WeatherMap lang={lang} />
                </>
            )}

            {/* Footer */}
            <footer className="app-footer">
                <p className="app-footer__text">{t('appTitle', lang)} &copy; {new Date().getFullYear()} &middot; {t('footer', lang)}</p>
            </footer>

            {/* Chat FAB */}
            <AIChatAssistant lang={lang} />
        </div>
    )
}
