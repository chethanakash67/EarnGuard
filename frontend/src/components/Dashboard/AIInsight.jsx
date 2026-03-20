import { useLang } from '../../context/LanguageContext'

export default function AIInsight({ data }) {
    const { t } = useLang()
    return (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-[#9ca3af]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4.08 16.86a3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
                </svg>
                <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">{t('aiInsight')}</span>
            </div>
            <p className="text-[#c7c7cc] text-[15px] leading-relaxed">{data.insight}</p>
        </div>
    )
}
