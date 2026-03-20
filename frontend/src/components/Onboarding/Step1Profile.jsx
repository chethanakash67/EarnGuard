import { useMemo, useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { JOB_TYPES, PLANS } from '../../constants/plans'
import { UserIcon, MapPinIcon, BriefcaseIcon, FlameIcon } from '../Icons'

const RISK_TO_PLAN = {
    'Construction Worker': 'elite',
    'Driver': 'pro',
    'Delivery': 'pro',
    'Auto Driver': 'pro',
    'Freelancer': 'standard',
}

export default function Step1Profile({ data, onChange, onNext, onBack }) {
    const { t } = useLang()
    const [form, setForm] = useState({
        name: data.name || '',
        jobType: data.jobType || '',
        city: data.city || '',
    })

    const valid = form.name.trim() && form.jobType && form.city.trim()

    const recommendedPlan = useMemo(() => {
        const fallback = PLANS.find(p => p.id === 'standard')
        const match = PLANS.find(p => p.id === RISK_TO_PLAN[form.jobType])
        return match || fallback
    }, [form.jobType])

    const projectedCoverage = useMemo(() => {
        if (!recommendedPlan) return 0
        if (!recommendedPlan.maxIncome) return 12000
        return Math.round(recommendedPlan.maxIncome * (recommendedPlan.coverage / 100))
    }, [recommendedPlan])

    const handleNext = (prefillPlan = null) => {
        if (!valid) return
        onChange(form)
        onNext(prefillPlan || recommendedPlan)
    }

    return (
        <div className="animate-[fadeIn_0.4s_ease] space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#22c55e]/15 bg-gradient-to-br from-[#111] via-[#0f1a12] to-[#0b0b0b] p-5">
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.18),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_45%)]" />
                <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-[11px] font-semibold uppercase tracking-wide mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                            Smart Match
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">{t('step1Title')}</h2>
                        <p className="text-[#9ca3af] text-sm max-w-md">{t('step1Desc')}</p>
                    </div>
                    {recommendedPlan && (
                        <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-right">
                            <div className="text-[11px] uppercase tracking-wide text-[#9ca3af]">Recommended</div>
                            <div className="text-white font-bold">{recommendedPlan.name}</div>
                            <div className="text-xs text-[#22c55e] font-semibold">Up to {recommendedPlan.coverage}% cover</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">{t('name')}</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                            <input
                                className="w-full pl-9 pr-4 py-3.5 bg-[#151515] border border-[#222] rounded-xl text-white placeholder:text-[#8b8b8b] outline-none focus:border-[#22c55e]/70 focus:ring-2 focus:ring-[#22c55e]/20 transition-colors duration-300"
                                placeholder={t('namePh') || 'e.g. Rahul Sharma'} value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">{t('city')}</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c6cdd5] w-4 h-4" />
                            <input
                                className="w-full pl-9 pr-4 py-3.5 bg-[#161616] border border-[#2c2c2c] rounded-xl text-[#f3f4f6] placeholder:text-[#d1d5db] outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/25 transition-colors duration-300"
                                placeholder={t('cityPh') || 'e.g. Mumbai'} value={form.city}
                                onChange={e => setForm({ ...form, city: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">{t('jobType')}</label>
                        <div className="relative">
                            <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                            <select
                                className="w-full pl-9 pr-4 py-3.5 bg-[#151515] border border-[#222] rounded-xl text-white outline-none focus:border-[#22c55e]/70 focus:ring-2 focus:ring-[#22c55e]/20 transition-colors duration-300 appearance-none"
                                value={form.jobType}
                                onChange={e => setForm({ ...form, jobType: e.target.value })}
                            >
                                <option value="" disabled>{t('selectJob')}</option>
                                {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] text-xs">▼</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-[#111]/70 border border-[#1f1f1f]">
                        <div className="text-[11px] uppercase tracking-wide text-[#9ca3af] mb-1">Payout potential</div>
                        <div className="text-xl font-bold text-white">₹{projectedCoverage.toLocaleString('en-IN')}</div>
                        <div className="text-xs text-[#9ca3af]">Est. weekly protection with {recommendedPlan?.name}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#111]/70 border border-[#1f1f1f]">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="text-[11px] uppercase tracking-wide text-[#9ca3af]">Coverage</div>
                            <span className="px-2 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-[11px] font-semibold">Higher profit</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#1f1f1f] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]" style={{ width: `${Math.min(recommendedPlan?.coverage || 0, 100)}%` }} />
                        </div>
                        <div className="text-white font-semibold text-sm mt-2">{recommendedPlan?.coverage}% income shield</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#111]/70 border border-[#1f1f1f]">
                        <div className="text-[11px] uppercase tracking-wide text-[#9ca3af] mb-1">Trust factor</div>
                        <div className="flex items-center gap-2 text-white font-semibold"><FlameIcon className="w-4 h-4 text-[#f59e0b]" /> 92% stickiness</div>
                        <div className="text-xs text-[#9ca3af]">Members stay after seeing first payout</div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
                    disabled={!valid} onClick={() => handleNext(recommendedPlan)}
                >Continue — fast-track with {recommendedPlan?.name}</button>

                <button
                    className="w-full py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold rounded-xl hover:border-[#3a3a3a] transition-all duration-300"
                    disabled={!valid} onClick={() => handleNext()}
                >{t('next')}</button>

                <button
                    className="w-full py-3 text-[#9ca3af] hover:text-white transition-colors text-sm"
                    type="button"
                    onClick={() => (onBack ? onBack() : window.history.back())}
                >{t('back')}</button>
            </div>
        </div>
    )
}
