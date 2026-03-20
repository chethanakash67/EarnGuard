import { useLang } from '../../context/LanguageContext'

export default function WeeklyReport({ data, planId }) {
    const { t } = useLang()
    if (!data) return null

    const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`
    const isElite = planId === 'elite'

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">{t('weeklyReport')}</h3>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
                {/* Stats row */}
                <div className="flex gap-6 mb-5 pb-5 border-b border-[#2a2a2a]">
                    <div>
                        <div className="text-xl font-bold text-[#ef4444]">{data.high_risk_days}</div>
                        <div className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-0.5">{t('highRiskDays')}</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-[#22c55e]">{fmt(data.total_compensation)}</div>
                        <div className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-0.5">{t('totalComp')}</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-white">{data.worst_day}</div>
                        <div className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-0.5">{t('mostImpacted')}</div>
                    </div>
                </div>

                {/* Summary */}
                <p className="text-[15px] text-[#c7c7cc] leading-relaxed mb-4">{data.summary}</p>

                {/* Upgrade tip — hidden for Elite */}
                {!isElite && data.tip && (
                    <div className="bg-[#111] border-l-3 border-[#f59e0b] rounded-lg px-4 py-3 text-[13px] text-[#9ca3af]">
                        💡 {data.tip}
                    </div>
                )}
            </div>
        </div>
    )
}
