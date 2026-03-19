import { t } from '../i18n'
import { CheckCircleIcon, AlertTriangleIcon, WeatherIcon, BrainIcon } from './Icons'

export default function Dashboard({ data, onReset, lang = 'en', isDemo = false }) {
    const {
        name,
        job_type,
        expected_income,
        weather,
        risk_level,
        actual_income,
        loss_percentage,
        payout,
        insight,
        protected: isProtected,
        tier,
        coverage_percentage,
    } = data

    const riskColor =
        risk_level === 'HIGH' ? 'red' : risk_level === 'MEDIUM' ? 'amber' : 'green'

    const formatCurrency = (val) =>
        `₹${Number(val).toLocaleString('en-IN')}`

    return (
        <div className="dashboard">
            {/* Greeting */}
            <h2 className="dashboard__greeting">{t('greeting', lang)} {name}</h2>
            <p className="dashboard__date">
                {t('weeklyAssessment', lang)} &middot; {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </p>

            {/* Tier badge */}
            {tier && (
                <div className={`tier-badge tier-badge--${tier}`}>
                    {tier.toUpperCase()} &middot; {coverage_percentage}% {t('compensation', lang).toLowerCase()}
                </div>
            )}

            {/* Status Banner */}
            <div className={`status-banner ${isProtected ? 'status-banner--protected' : 'status-banner--safe'}`}>
                <span className="status-banner__icon">
                    {isProtected
                        ? <CheckCircleIcon size={28} />
                        : <AlertTriangleIcon size={28} />}
                </span>
                <p className="status-banner__text">
                    {isProtected
                        ? `${t('protectedMsg', lang)} ${formatCurrency(payout)} ${t('compensationIssued', lang)}`
                        : t('noPayout', lang)}
                </p>
            </div>

            {/* Weather Pill */}
            <div className="weather-pill">
                <span className="weather-pill__icon">
                    <WeatherIcon condition={weather.condition} size={18} />
                </span>
                <span>{weather.condition} &middot; {weather.temperature}°C &middot; {weather.rain_probability}% rain</span>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-card__label">{t('expectedIncome', lang)}</div>
                    <div className="metric-card__value">{formatCurrency(expected_income)}</div>
                </div>

                <div className="metric-card">
                    <div className="metric-card__label">{t('actualIncome', lang)}</div>
                    <div className={`metric-card__value ${isProtected ? 'metric-card__value--red' : ''}`}>
                        {formatCurrency(actual_income)}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-card__label">{t('compensation', lang)}</div>
                    <div className={`metric-card__value ${isProtected ? 'metric-card__value--green' : ''}`}>
                        {formatCurrency(payout)}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-card__label">{t('incomeLoss', lang)}</div>
                    <div className={`metric-card__value ${loss_percentage > 0 ? 'metric-card__value--red' : ''}`}>
                        {loss_percentage}%
                    </div>
                </div>

                {/* Risk Level – full width */}
                <div className="metric-card risk-card">
                    <div className="metric-card__label">{t('riskLevel', lang)}</div>
                    <div className="risk-indicator">
                        <span className={`risk-dot risk-dot--${riskColor === 'red' ? 'high' : riskColor === 'amber' ? 'medium' : 'low'}`}></span>
                        <span className={`metric-card__value metric-card__value--${riskColor}`}>
                            {risk_level}
                        </span>
                    </div>
                </div>
            </div>

            {/* AI Insight */}
            <div className="insight-card">
                <div className="insight-card__header">
                    <BrainIcon size={18} />
                    <span className="insight-card__label">{t('aiInsight', lang)}</span>
                </div>
                <p className="insight-card__text">{insight}</p>
            </div>

            {/* Reset Button */}
            {!isDemo && (
                <button className="btn btn--secondary" onClick={onReset}>
                    {t('assessAgain', lang)}
                </button>
            )}
        </div>
    )
}
