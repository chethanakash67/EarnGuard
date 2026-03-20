import { useLang } from '../../context/LanguageContext'

export default function MetricCards({ data }) {
    const { t } = useLang()
    const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`
    const { expected_income, actual_income, compensation, loss_percentage, risk_level, protected: isProt } = data

    const riskColors = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' }

    return (
        <>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <Card label={t('expectedIncome')} value={fmt(expected_income)} />
                <Card label={t('actualIncome')} value={fmt(actual_income)} color={isProt ? '#ef4444' : '#ffffff'} />
                <Card label={t('compensation')} value={fmt(compensation)} color={isProt ? '#22c55e' : '#ffffff'} />
                <Card label={t('incomeLoss')} value={`${loss_percentage}%`} color={loss_percentage > 0 ? '#ef4444' : '#ffffff'} />
            </div>

            {/* Risk level */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 mb-5">
                <div className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">{t('riskLevel')}</div>
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: riskColors[risk_level] }} />
                    <span className="text-xl font-bold" style={{ color: riskColors[risk_level] }}>{risk_level}</span>
                </div>
            </div>
        </>
    )
}

function Card({ label, value, color = '#ffffff' }) {
    return (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 hover:border-[#3a3a3a] transition-colors duration-300">
            <div className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">{label}</div>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
        </div>
    )
}
