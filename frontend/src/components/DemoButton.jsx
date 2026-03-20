import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import { useUser } from '../context/UserContext'

export default function DemoButton({ onScenarioChange }) {
    const { t } = useLang()
    const { user } = useUser()
    const [running, setRunning] = useState(false)
    const [scenarios, setScenarios] = useState(null)
    const [idx, setIdx] = useState(0)
    const timer = useRef(null)

    const startDemo = async () => {
        try {
            const res = await fetch('/api/demo-scenarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user?.name || 'Demo User',
                    job_type: user?.jobType || 'Delivery',
                    expected_income: user?.maxIncome || 5000,
                    plan: user?.plan || 'pro',
                }),
            })
            const data = await res.json()
            setScenarios(data.scenarios)
            setIdx(0)
            setRunning(true)
            onScenarioChange(data.scenarios[0])
        } catch (e) {
            console.error('Demo failed:', e)
        }
    }

    useEffect(() => {
        if (!running || !scenarios) return
        timer.current = setTimeout(() => {
            const next = idx + 1
            if (next < scenarios.length) {
                setIdx(next)
                onScenarioChange(scenarios[next])
            } else {
                setRunning(false)
                onScenarioChange(null)
            }
        }, 2000)
        return () => clearTimeout(timer.current)
    }, [idx, running, scenarios])

    const stopDemo = () => {
        clearTimeout(timer.current)
        setRunning(false)
        onScenarioChange(null)
    }

    return (
        <>
            {/* DEMO MODE label */}
            {running && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-black text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full z-50 animate-pulse">
                    {t('demoMode')} — {scenarios[idx]?.label}
                </div>
            )}

            {/* FAB */}
            <button
                className={`fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-50 transition-all duration-300 shadow-lg ${running ? 'bg-[#ef4444] hover:bg-red-600' : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] text-[#9ca3af] hover:text-white'
                    }`}
                onClick={running ? stopDemo : startDemo}
                title={running ? t('exitDemo') : 'Demo'}
            >
                {running ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
            </button>
        </>
    )
}
