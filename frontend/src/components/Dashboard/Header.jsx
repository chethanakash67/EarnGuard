import { useLang, LANGUAGES } from '../../context/LanguageContext'
import { useUser } from '../../context/UserContext'

export default function Header() {
    const { lang, setLang, t } = useLang()
    const { user } = useUser()

    return (
        <header className="flex items-center justify-between mb-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
                <svg className="w-7 h-7 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-white font-bold text-lg tracking-tight">{t('appTitle')}</span>
            </div>

            <div className="flex items-center gap-3">
                {/* Language toggle */}
                <div className="flex bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden">
                    {LANGUAGES.map(l => (
                        <button key={l.code}
                            className={`px-2.5 py-1 text-[10px] font-semibold transition-all ${lang === l.code ? 'bg-[#2a2a2a] text-white' : 'text-[#9ca3af] hover:text-white'
                                }`}
                            onClick={() => setLang(l.code)}
                        >{l.label}</button>
                    ))}
                </div>

                {/* Plan badge */}
                {user && (
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">
                        {user.planName}
                    </div>
                )}
            </div>
        </header>
    )
}
