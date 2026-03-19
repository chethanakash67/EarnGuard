import { useState, useEffect, useRef } from 'react'
import { t } from '../i18n'
import Dashboard from './Dashboard'
import { ShieldIcon } from './Icons'

export default function AutoDemo({ formData, lang = 'en', onClose }) {
    const [scenarios, setScenarios] = useState(null)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [playing, setPlaying] = useState(true)
    const timerRef = useRef(null)

    // Fetch demo scenarios
    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const res = await fetch('/api/demo-scenarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name || 'Demo User',
                        job_type: formData.jobType || 'Delivery',
                        expected_income: Number(formData.income) || 5000,
                        tier: formData.tier || 'pro',
                    }),
                })
                const data = await res.json()
                setScenarios(data.scenarios)
            } catch {
                onClose()
            }
        }
        fetchScenarios()
    }, [])

    // Auto-cycle scenarios
    useEffect(() => {
        if (!scenarios || !playing) return

        timerRef.current = setTimeout(() => {
            if (currentIdx < scenarios.length - 1) {
                setCurrentIdx((i) => i + 1)
            } else {
                setPlaying(false)
            }
        }, 4000)

        return () => clearTimeout(timerRef.current)
    }, [currentIdx, scenarios, playing])

    if (!scenarios) {
        return (
            <div className="demo-loading">
                <ShieldIcon size={40} />
                <p>{t('demoRunning', lang)}</p>
            </div>
        )
    }

    const scenario = scenarios[currentIdx]

    return (
        <div className="auto-demo">
            {/* Demo controls bar */}
            <div className="demo-controls">
                <div className="demo-controls__label">
                    {t('autoDemo', lang)}
                </div>
                <div className="demo-controls__scenarios">
                    {scenarios.map((s, i) => (
                        <button
                            key={i}
                            className={`demo-scenario-btn ${i === currentIdx ? 'demo-scenario-btn--active' : ''} ${i < currentIdx ? 'demo-scenario-btn--done' : ''}`}
                            onClick={() => { setCurrentIdx(i); setPlaying(false); }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
                <div className="demo-controls__actions">
                    <button
                        className="demo-play-btn"
                        onClick={() => {
                            if (!playing) {
                                setCurrentIdx(0)
                                setPlaying(true)
                            } else {
                                setPlaying(false)
                            }
                        }}
                    >
                        {playing ? 'Pause' : 'Replay'}
                    </button>
                    <button className="demo-close-btn" onClick={onClose}>Exit Demo</button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="demo-progress">
                <div
                    className="demo-progress__fill"
                    style={{ width: `${((currentIdx + 1) / scenarios.length) * 100}%` }}
                />
            </div>

            {/* Scenario dashboard */}
            <div className="demo-dashboard" key={currentIdx}>
                <Dashboard data={scenario} onReset={onClose} lang={lang} isDemo />
            </div>
        </div>
    )
}
