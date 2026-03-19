import { t } from '../i18n'
import { WeatherIcon } from './Icons'

export default function Forecast({ data, lang = 'en' }) {
    if (!data || !data.days) return null

    const { days, total_estimated_payout } = data
    const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}`

    const riskColor = (level) =>
        level === 'HIGH' ? 'var(--red)' : level === 'MEDIUM' ? 'var(--amber)' : 'var(--green)'

    return (
        <div className="forecast-section">
            <h3 className="section-title">{t('fiveDayForecast', lang)}</h3>

            <div className="forecast-cards">
                {days.map((day, i) => (
                    <div
                        className="forecast-card"
                        key={i}
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <span className="forecast-card__day">{day.day_name.slice(0, 3)}</span>
                        <span className="forecast-card__date">{day.date}</span>
                        <span className="forecast-card__icon">
                            <WeatherIcon condition={day.weather.condition} size={22} />
                        </span>
                        <span className="forecast-card__temp">{day.weather.temperature}°</span>
                        <span
                            className="forecast-card__risk"
                            style={{ color: riskColor(day.risk_level) }}
                        >
                            {day.risk_level}
                        </span>
                        {day.estimated_payout > 0 && (
                            <span className="forecast-card__payout">
                                {formatCurrency(day.estimated_payout)}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {total_estimated_payout > 0 && (
                <div className="forecast-total">
                    <span className="forecast-total__label">{t('totalEstPayout', lang)}</span>
                    <span className="forecast-total__value">{formatCurrency(total_estimated_payout)}</span>
                </div>
            )}
        </div>
    )
}
