import { useLang } from '../context/LanguageContext'
import { getNextPlan } from '../constants/plans'

export default function PlanUpgradeModal({ planId, maxIncome, suggestedPlan, onUpgrade, onCap, onClose }) {
    const { t } = useLang()
    const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`

    const next = suggestedPlan || getNextPlan(planId)

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease]">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full animate-[slideUp_0.3s_ease]">
                {/* Warning icon */}
                <div className="mx-auto w-12 h-12 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#f59e0b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>

                <h3 className="text-white font-bold text-center text-lg mb-2">Income Exceeds Plan Limit</h3>
                <p className="text-[#9ca3af] text-sm text-center mb-5">
                    {t('upgradeMsg')} <span className="text-white font-semibold">{fmt(maxIncome)}{t('perWeek')}</span>
                </p>

                <div className="space-y-2.5">
                    {next && (
                        <button
                            className="w-full py-3.5 bg-[#22c55e] text-black font-semibold rounded-xl hover:bg-[#16a34a] transition-colors"
                            onClick={() => onUpgrade(next)}
                        >
                            {t('upgrade')} {next.name} →
                        </button>
                    )}
                    <button
                        className="w-full py-3.5 bg-[#2a2a2a] text-white font-semibold rounded-xl hover:bg-[#3a3a3a] transition-colors"
                        onClick={() => onCap(maxIncome)}
                    >
                        {t('upgradeOr')} {fmt(maxIncome)} {t('instead')}
                    </button>
                    <button
                        className="w-full py-2 text-[#9ca3af] text-sm hover:text-white transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
