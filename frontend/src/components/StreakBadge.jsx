import { t } from '../i18n'
import { ShieldCheckIcon } from './Icons'

export default function StreakBadge({ streak = 0, lang = 'en' }) {
    if (streak <= 0) return null

    const tier = streak >= 8 ? 'gold' : streak >= 5 ? 'silver' : 'bronze'

    return (
        <div className={`streak-badge streak-badge--${tier}`}>
            <div className="streak-badge__icon">
                <ShieldCheckIcon size={22} />
            </div>
            <div className="streak-badge__info">
                <span className="streak-badge__count">{streak}</span>
                <span className="streak-badge__label">{t('weeksStrong', lang)}</span>
            </div>
            <span className="streak-badge__tier">{tier.toUpperCase()}</span>
        </div>
    )
}
