import { LANGUAGES } from '../i18n'

export default function LanguageSwitcher({ lang, onLangChange }) {
    return (
        <div className="lang-switcher">
            {LANGUAGES.map((l) => (
                <button
                    key={l.code}
                    className={`lang-switcher__btn ${lang === l.code ? 'lang-switcher__btn--active' : ''}`}
                    onClick={() => onLangChange(l.code)}
                >
                    {l.label}
                </button>
            ))}
        </div>
    )
}
