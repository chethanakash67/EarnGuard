import { useLang } from '../../context/LanguageContext'
import confetti from 'canvas-confetti'

export default function Step3Activate({ data, onActivate, onBack }) {
    const { t } = useLang()
    const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`

    const handleActivate = () => {
        // Fire confetti
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#22c55e', '#ffffff', '#f59e0b'] })
        setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } }), 300)
        setTimeout(() => onActivate(), 800)
    }

    return (
        <div className="animate-[fadeIn_0.4s_ease] text-center">
            {/* Shield icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-[#22c55e]/10 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">{t('step3Title')}</h2>
            <p className="text-[#9ca3af] text-sm mb-8">{t('step3Desc')}</p>

            {/* Summary card */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-6 text-left">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#2a2a2a]">
                    <span className="text-[#9ca3af] text-sm">Plan</span>
                    <span className="text-white font-bold">{data.planName} <span className="text-[#22c55e] text-sm">· {data.coverage}%</span></span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#2a2a2a]">
                    <span className="text-[#9ca3af] text-sm">{t('maxIncome')}</span>
                    <span className="text-white font-bold">{fmt(data.maxIncome)}{t('perWeek')}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#2a2a2a]">
                    <span className="text-[#9ca3af] text-sm">Subscription</span>
                    <span className="text-white font-bold">{fmt(data.price)}{data.billing === 'monthly' ? t('perMonth') : t('perWeek')}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#9ca3af] text-sm">{t('coverage')}</span>
                    <span className="text-[#22c55e] font-bold text-xl">{data.coverage}%</span>
                </div>
            </div>

            <p className="text-[#9ca3af] text-sm mb-6">
                {t('coveredUp')} <span className="text-white font-bold">{fmt(data.maxIncome)}{t('perWeek')}</span> {t('forPrice')} <span className="text-white font-bold">{fmt(data.price)}{data.billing === 'monthly' ? t('perMonth') : t('perWeek')}</span>
            </p>

            <button
                className="w-full py-4 bg-[#22c55e] text-black font-bold text-lg rounded-xl hover:bg-[#16a34a] transition-all duration-300 active:scale-[0.98]"
                onClick={handleActivate}
            >{t('activate')}</button>

            <button className="w-full mt-3 py-3 text-[#9ca3af] hover:text-white transition-colors text-sm" onClick={onBack}>{t('back')}</button>
        </div>
    )
}
