import { useState, useEffect } from 'react'
import { t } from '../i18n'

export default function EarningsChart({ data, lang = 'en' }) {
    const [animated, setAnimated] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100)
        return () => clearTimeout(timer)
    }, [])

    if (!data || !data.weeks) return null

    const { weeks, total_payout, protected_weeks } = data
    const maxVal = Math.max(...weeks.map((w) => Math.max(w.expected, w.actual)))

    const getBarHeight = (val) => {
        const pct = (val / maxVal) * 100
        return animated ? `${pct}%` : '0%'
    }

    const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}`

    return (
        <div className="chart-section">
            <h3 className="section-title">{t('earningsHistory', lang)}</h3>

            {/* Summary row */}
            <div className="chart-summary">
                <div className="chart-summary__item">
                    <span className="chart-summary__value chart-summary__value--green">
                        {formatCurrency(total_payout)}
                    </span>
                    <span className="chart-summary__label">{t('totalProtected', lang)}</span>
                </div>
                <div className="chart-summary__item">
                    <span className="chart-summary__value">{protected_weeks}/8</span>
                    <span className="chart-summary__label">{t('weeksProtected', lang)}</span>
                </div>
            </div>

            {/* Bar chart */}
            <div className="chart-container">
                <div className="chart-bars">
                    {weeks.map((week, i) => (
                        <div className="chart-bar-group" key={i}>
                            <div className="chart-bar-pair">
                                <div className="chart-bar-wrapper">
                                    <div
                                        className="chart-bar chart-bar--expected"
                                        style={{ height: getBarHeight(week.expected), transitionDelay: `${i * 60}ms` }}
                                        title={`${t('expected', lang)}: ${formatCurrency(week.expected)}`}
                                    />
                                </div>
                                <div className="chart-bar-wrapper">
                                    <div
                                        className={`chart-bar chart-bar--actual ${week.actual < week.expected ? 'chart-bar--loss' : ''}`}
                                        style={{ height: getBarHeight(week.actual), transitionDelay: `${i * 60 + 30}ms` }}
                                        title={`${t('actual', lang)}: ${formatCurrency(week.actual)}`}
                                    />
                                </div>
                            </div>
                            <span className="chart-bar-label">{week.week}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="chart-legend">
                <div className="chart-legend__item">
                    <span className="chart-legend__dot chart-legend__dot--expected" />
                    <span>{t('expected', lang)}</span>
                </div>
                <div className="chart-legend__item">
                    <span className="chart-legend__dot chart-legend__dot--actual" />
                    <span>{t('actual', lang)}</span>
                </div>
            </div>
        </div>
    )
}
