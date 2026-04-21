import { useState, useEffect } from 'react'
import { useLang } from './context/LanguageContext'
import { useUser } from './context/UserContext'
import { getPlanById } from './constants/plans'

// Onboarding
import Step1Profile from './components/Onboarding/Step1Profile'
import Step2Plans from './components/Onboarding/Step2Plans'
import Step3Activate from './components/Onboarding/Step3Activate'
import Landing from './components/Landing'

// Dashboard
import Header from './components/Dashboard/Header'
import StreakBanner from './components/Dashboard/StreakBanner'
import MetricCards from './components/Dashboard/MetricCards'
import AIInsight from './components/Dashboard/AIInsight'
import EarningsChart from './components/Dashboard/EarningsChart'
import ForecastCards from './components/Dashboard/ForecastCards'
import WeeklyReport from './components/Dashboard/WeeklyReport'
import RiskMap from './components/Dashboard/RiskMap'
//update
// Shared
import PlanUpgradeModal from './components/PlanUpgradeModal'
import DemoButton from './components/DemoButton'
import { CheckCircleIcon, AlertTriangleIcon, ShieldCheckIcon } from './components/Icons'
import { apiUrl } from './api'

export default function App() {
    const { t } = useLang()
    const { user, saveUser } = useUser()

    // Onboarding state
    const [step, setStep] = useState(0)
    const [profileData, setProfileData] = useState({})
    const [planData, setPlanData] = useState({})

    // Dashboard state
    const [view, setView] = useState('landing') // landing | onboarding | loading | dashboard
    const [income, setIncome] = useState('')
    const [result, setResult] = useState(null)
    const [historyData, setHistoryData] = useState(null)
    const [forecastData, setForecastData] = useState(null)
    const [reportData, setReportData] = useState(null)
    const [mapData, setMapData] = useState(null)
    const [error, setError] = useState('')
    const [upgradeModal, setUpgradeModal] = useState(null)
    const [loading, setLoading] = useState(false)

    // Demo override happend
    const [demoResult, setDemoResult] = useState(null)

    const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`

    // Onboarding handlers
    const handleActivate = () => {
        const userData = {
            name: profileData.name,
            jobType: profileData.jobType,
            city: profileData.city,
            plan: planData.plan,
            planName: planData.planName,
            billing: planData.billing,
            maxIncome: planData.maxIncome,
            coverage: planData.coverage,
            customIncome: planData.customIncome,
            price: planData.price,
        }
        saveUser(userData)
        setView('dashboard')
    }

    // Risk assessment
    const handleAssess = async () => {
        if (!user) return
        const incomeVal = Number(income)
        if (!incomeVal || incomeVal <= 0) return

        setError('')
        setLoading(true)

        try {
            const res = await fetch(apiUrl('/api/assess'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.name,
                    job_type: user.jobType,
                    city: user.city,
                    expected_income: incomeVal,
                    plan: user.plan,
                    custom_income: user.customIncome,
                }),
            })
            const data = await res.json()

            if (!res.ok) {
                if (data.error === 'Income exceeds plan limit') {
                    setUpgradeModal({ maxIncome: data.max_allowed, suggestedPlan: data.suggested_plan })
                    setLoading(false)
                    return
                }
                throw new Error(data.error)
            }

            // Fetch extras in parallel
            const params = `job_type=${encodeURIComponent(user.jobType)}&expected_income=${incomeVal}&plan=${user.plan}`
            const [histRes, foreRes, repRes, mapRes] = await Promise.all([
                fetch(apiUrl(`/api/history?${params}`)),
                fetch(apiUrl(`/api/forecast?city=${encodeURIComponent(user.city)}&${params}`)),
                fetch(apiUrl('/api/report'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: user.name, job_type: user.jobType, expected_income: incomeVal, plan: user.plan }),
                }),
                fetch(apiUrl(`/api/map?city=${encodeURIComponent(user.city)}`)),
            ])

            const [hist, fore, rep, mp] = await Promise.all([histRes.json(), foreRes.json(), repRes.json(), mapRes.json()])

            await new Promise(r => setTimeout(r, 1500))

            setResult(data)
            setHistoryData(hist)
            setForecastData(fore)
            setReportData(rep)
            setMapData(mp)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setResult(null)
        setHistoryData(null)
        setForecastData(null)
        setReportData(null)
        setMapData(null)
        setDemoResult(null)
    }

    const handleUpgrade = (nextPlan) => {
        const updated = { ...user, plan: nextPlan.id, planName: nextPlan.name, maxIncome: nextPlan.maxIncome || nextPlan.max_income, coverage: nextPlan.coverage * 100 || nextPlan.coverage }
        saveUser(updated)
        setUpgradeModal(null)
    }

    const handleCap = (maxIncome) => {
        setIncome(String(maxIncome))
        setUpgradeModal(null)
    }

    const displayData = demoResult || result

    // ONBOARDING
    if (view === 'landing') {
        return (
            <Landing
                hasUser={!!user}
                onStart={() => { setStep(0); setView('onboarding') }}
                onResume={() => setView('dashboard')}
            />
        )
    }

    if (view === 'onboarding') {
        return (
            <div className="max-w-md mx-auto px-5 py-8 min-h-screen flex flex-col relative">
                <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.08),_transparent_40%)]" />
                {/* Progress */}
                <div className="relative z-10 flex justify-center gap-2 mb-2">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-white w-12' : 'bg-[#2a2a2a] w-8'}`} />
                    ))}
                </div>
                <div className="relative z-10 text-center text-[11px] text-[#9ca3af] mb-8">Step {step + 1} of 3</div>

                <div className="relative z-10 bg-[#111111]/70 backdrop-blur-sm border border-[#2a2a2a] rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                    {step === 0 && (
                        <Step1Profile
                            data={profileData}
                            onChange={setProfileData}
                            onBack={() => setView('landing')}
                            onNext={(prefillPlan) => {
                                if (prefillPlan) {
                                    setPlanData(prev => ({
                                        ...prev,
                                        plan: prefillPlan.id,
                                        planName: prefillPlan.name,
                                        maxIncome: prefillPlan.maxIncome,
                                        coverage: prefillPlan.coverage,
                                    }))
                                }
                                setStep(1)
                            }}
                        />
                    )}
                    {step === 1 && <Step2Plans data={planData} onChange={setPlanData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                    {step === 2 && <Step3Activate data={planData} onActivate={handleActivate} onBack={() => setStep(1)} />}
                </div>
            </div>
        )
    }

    // DASHBOARD
    return (
        <div className="max-w-2xl mx-auto px-5 py-6 min-h-screen flex flex-col">
            <Header />

            {/* Streak */}
            <StreakBanner streak={historyData?.streak || 0} />

            {/* If we have an assessment result */}
            {displayData ? (
                <div className="animate-[fadeIn_0.4s_ease]">
                    {/* Greeting */}
                    <h2 className="text-2xl font-bold text-white mb-0.5">Hey, {displayData.name}</h2>
                    <p className="text-sm text-[#9ca3af] mb-3">
                        {t('weeklyAssessment')} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    {/* Plan badge */}
                    <div className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1 text-[#9ca3af] mb-5">
                        {displayData.plan_name} · {displayData.coverage_pct}% {t('planBadge')}
                    </div>

                    {/* Status banner */}
                    <div className={`rounded-2xl p-4 flex items-center gap-3 mb-5 ${displayData.protected
                            ? 'bg-[#22c55e]/8 border border-[#22c55e]/20'
                            : 'bg-[#f59e0b]/8 border border-[#f59e0b]/20'
                        }`}>
                        {displayData.protected
                            ? <CheckCircleIcon className="w-5 h-5 text-[#22c55e]" />
                            : <AlertTriangleIcon className="w-5 h-5 text-[#f59e0b]" />}
                        <p className={`text-sm font-medium ${displayData.protected ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>
                            {displayData.protected
                                ? `${t('youAreProtected')} ${fmt(displayData.compensation)} ${t('compIssued')}`
                                : t('noPayout')
                            }
                        </p>
                    </div>

                    {/* Weather pill */}
                    <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2 text-sm text-[#9ca3af] mb-5">
                        <span>{displayData.weather.condition}</span>
                        <span>·</span>
                        <span>{displayData.weather.temperature}°C</span>
                        <span>·</span>
                        <span>{displayData.weather.rain_probability}% rain</span>
                    </div>

                    <MetricCards data={displayData} />
                    <AIInsight data={displayData} />

                    <button
                        className="w-full py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold rounded-xl hover:bg-[#2a2a2a] transition-colors mb-8"
                        onClick={handleReset}
                    >{t('assessAgain')}</button>

                    <EarningsChart data={historyData} />
                    <ForecastCards data={forecastData} />
                    <WeeklyReport data={reportData} planId={user?.plan} />
                    <RiskMap data={mapData} userCity={user?.city} />
                </div>
            ) : (
                /* Income input form */
                <div className="animate-[fadeIn_0.4s_ease]">
                    <h2 className="text-2xl font-bold text-white mb-1">Hey, {user?.name}</h2>
                    <p className="text-sm text-[#9ca3af] mb-6">
                        {t('weeklyAssessment')} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <div className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1 text-[#9ca3af] mb-6">
                        {user?.planName} · {user?.coverage}% {t('planBadge')}
                    </div>

                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5 text-sm text-[#9ca3af]"><ShieldCheckIcon className="w-4 h-4" /> Protection check for {user?.jobType}</div>
                            <div className="text-xs font-semibold text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full px-2 py-1">AI Ready</div>
                        </div>
                        <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">
                            {t('enterIncome')}
                            <span className="text-[#9ca3af] font-normal normal-case ml-1">(max {fmt(user?.maxIncome || 0)})</span>
                        </label>
                        <div className="relative mb-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">₹</span>
                            <input
                                type="number" min="1" placeholder="5000"
                                className="w-full pl-8 pr-4 py-3.5 bg-[#111] border border-[#2a2a2a] rounded-xl text-white outline-none focus:border-[#3a3a3a] transition-colors"
                                value={income} onChange={e => setIncome(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="text-[#ef4444] text-sm mb-4 px-1">{error}</div>
                        )}

                        <button
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={!income || Number(income) <= 0 || loading}
                            onClick={handleAssess}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Analyzing...
                                </span>
                            ) : t('analyzeRisk')}
                        </button>

                        <button
                            className="w-full mt-3 py-3 text-[#9ca3af] hover:text-white transition-colors text-sm"
                            type="button"
                            onClick={() => setView('onboarding')}
                        >
                            {t('back')}
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="mt-auto pt-8 pb-4 text-center">
                <p className="text-xs text-[#4a4a4a]">{t('appTitle')} © {new Date().getFullYear()} · Simulated Demo</p>
            </footer>

            {/* Upgrade modal */}
            {upgradeModal && (
                <PlanUpgradeModal
                    planId={user?.plan}
                    maxIncome={upgradeModal.maxIncome}
                    suggestedPlan={upgradeModal.suggestedPlan}
                    onUpgrade={handleUpgrade}
                    onCap={handleCap}
                    onClose={() => setUpgradeModal(null)}
                />
            )}

            {/* Demo FAB */}
            <DemoButton onScenarioChange={setDemoResult} />
        </div>
    )
}
