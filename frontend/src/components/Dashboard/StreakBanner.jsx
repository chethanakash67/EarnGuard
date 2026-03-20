import { useLang } from '../../context/LanguageContext'

const TIERS = [
    { min: 1, max: 4, name: 'BRONZE', color: '#cd7f32', bg: 'rgba(205,127,50,0.1)', border: 'rgba(205,127,50,0.25)' },
    { min: 5, max: 9, name: 'SILVER', color: '#c0c0c0', bg: 'rgba(192,192,192,0.1)', border: 'rgba(192,192,192,0.25)' },
    { min: 10, max: 19, name: 'GOLD', color: '#ffd700', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.25)' },
    { min: 20, max: Infinity, name: 'PLATINUM', color: '#e5e4e2', bg: 'rgba(229,228,226,0.1)', border: 'rgba(229,228,226,0.25)' },
]

export default function StreakBanner({ streak = 0 }) {
    const { t } = useLang()
    if (streak <= 0) return null

    const tier = TIERS.find(t => streak >= t.min && streak <= t.max) || TIERS[0]

    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5 transition-all" style={{ background: tier.bg, border: `1px solid ${tier.border}` }}>
            <svg className="w-5 h-5 shrink-0" style={{ color: tier.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
            </svg>
            <span className="text-white font-bold text-sm">{streak}</span>
            <span className="text-[#9ca3af] text-sm">{t('streakLabel')}</span>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: tier.color, background: `${tier.color}22` }}>
                {tier.name}
            </span>
        </div>
    )
}
