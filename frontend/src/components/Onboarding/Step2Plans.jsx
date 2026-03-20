import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { PLANS, getCustomPrice } from '../../constants/plans'

export default function Step2Plans({ data, onChange, onNext, onBack }) {
    const { t } = useLang()
    const [billing, setBilling] = useState(data.billing || 'weekly')
    const [selected, setSelected] = useState(data.plan || '')
    const [customIncome, setCustomIncome] = useState(data.customIncome || '')

    const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`

    const getPrice = (plan) => {
        if (plan.id === 'custom') {
            const ci = Number(customIncome) || 0
            return ci > 0 ? getCustomPrice(ci, billing) : 0
        }
        return billing === 'monthly' ? plan.monthlyPrice : plan.weeklyPrice
    }

    const handleSelect = (id) => {
        setSelected(id)
    }

    const valid = selected && (selected !== 'custom' || (Number(customIncome) > 0))

    const handleNext = () => {
        if (!valid) return
        const plan = PLANS.find(p => p.id === selected)
        const ci = selected === 'custom' ? Number(customIncome) : null
        onChange({
            plan: selected,
            billing,
            customIncome: ci,
            planName: plan.name,
            maxIncome: selected === 'custom' ? ci : plan.maxIncome,
            coverage: plan.coverage,
            price: getPrice(plan),
        })
        onNext()
    }

    return (
        <div className="animate-[fadeIn_0.4s_ease]">
            <h2 className="text-2xl font-bold text-white mb-1">{t('step2Title')}</h2>
            <p className="text-[#9ca3af] text-sm mb-6">{t('step2Desc')}</p>

            {/* Billing toggle */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex bg-[#1a1a1a] rounded-xl p-1 border border-[#2a2a2a]">
                    {['weekly', 'monthly'].map(b => (
                        <button key={b}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${billing === b ? 'bg-white text-black' : 'text-[#9ca3af] hover:text-white'
                                }`}
                            onClick={() => setBilling(b)}
                        >{t(b)}</button>
                    ))}
                </div>
                {billing === 'monthly' && (
                    <span className="ml-3 self-center text-xs text-[#22c55e] font-semibold">Save ~12%</span>
                )}
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {PLANS.map(plan => {
                    const isSelected = selected === plan.id
                    const isPro = plan.popular
                    const price = getPrice(plan)
                    const isCustom = plan.id === 'custom'

                    return (
                        <button key={plan.id} type="button"
                            className={`relative text-left p-4 rounded-2xl border transition-all duration-300 ${isSelected
                                    ? 'border-[#22c55e] bg-[#22c55e]/5'
                                    : isPro
                                        ? 'border-[#22c55e]/40 bg-[#1a1a1a] hover:border-[#22c55e]/70'
                                        : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a]'
                                }`}
                            onClick={() => handleSelect(plan.id)}
                        >
                            {isPro && (
                                <span className="absolute -top-2.5 right-3 bg-[#22c55e] text-black text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wide">
                                    {t('popular')}
                                </span>
                            )}
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-white font-bold text-base">{plan.name}</span>
                                <span className="text-[#22c55e] font-bold text-base">
                                    {plan.coverage}% <span className="text-[10px] text-[#9ca3af] font-normal">{t('coverage')}</span>
                                </span>
                            </div>
                            {!isCustom && (
                                <div className="text-[#9ca3af] text-xs mb-2">{t('maxIncome')} {fmt(plan.maxIncome)}{t('perWeek')}</div>
                            )}
                            <div className="text-white font-bold text-lg">
                                {isCustom
                                    ? (price > 0 ? fmt(price) : '—')
                                    : fmt(price)
                                }
                                <span className="text-xs text-[#9ca3af] font-normal">{billing === 'monthly' ? t('perMonth') : t('perWeek')}</span>
                            </div>
                            <div className="text-[#9ca3af] text-[11px] mt-1.5 leading-snug">{plan.benefit}</div>

                            {/* Custom income input */}
                            {isCustom && isSelected && (
                                <div className="mt-3" onClick={e => e.stopPropagation()}>
                                    <input
                                        type="number" min="1" placeholder={t('customPh')}
                                        className="w-full px-3 py-2 bg-[#111] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-[#3a3a3a]"
                                        value={customIncome}
                                        onChange={e => setCustomIncome(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Selection indicator */}
                            <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-all ${isSelected ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#3a3a3a]'
                                }`}>
                                {isSelected && (
                                    <svg viewBox="0 0 16 16" className="w-full h-full text-black p-0.5"><path fill="currentColor" d="M6.5 12L2 7.5 3.5 6l3 3L12.5 3 14 4.5z" /></svg>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            <div className="flex gap-3 mt-6">
                <button className="flex-1 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold rounded-xl hover:bg-[#2a2a2a] transition-colors" onClick={onBack}>{t('back')}</button>
                <button className="flex-[2] py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed" disabled={!valid} onClick={handleNext}>{t('next')}</button>
            </div>
        </div>
    )
}
