import { useState, useEffect } from 'react'
import { t } from '../i18n'
import { BrainIcon } from './Icons'

export default function AIReport({ data, lang = 'en' }) {
    const [revealed, setRevealed] = useState(0)

    useEffect(() => {
        if (!data) return
        const text = data.summary || ''
        if (revealed < text.length) {
            const timer = setTimeout(() => setRevealed((r) => r + 2), 10)
            return () => clearTimeout(timer)
        }
    }, [revealed, data])

    if (!data) return null

    const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}`

    return (
        <div className="ai-report">
            <h3 className="section-title">{t('weeklyReport', lang)}</h3>

            <div className="ai-report__card">
                {/* Stats row */}
                <div className="ai-report__stats">
                    <div className="ai-report__stat">
                        <span className="ai-report__stat-value ai-report__stat-value--red">
                            {data.high_risk_days}
                        </span>
                        <span className="ai-report__stat-label">{t('highRiskDays', lang)}</span>
                    </div>
                    <div className="ai-report__stat">
                        <span className="ai-report__stat-value ai-report__stat-value--green">
                            {formatCurrency(data.total_payout)}
                        </span>
                        <span className="ai-report__stat-label">{t('totalCompensation', lang)}</span>
                    </div>
                    {data.worst_day && (
                        <div className="ai-report__stat">
                            <span className="ai-report__stat-value">{data.worst_day}</span>
                            <span className="ai-report__stat-label">{t('worstDay', lang)}</span>
                        </div>
                    )}
                </div>

                {/* Typewriter text */}
                <div className="ai-report__text">
                    <div className="ai-report__text-header">
                        <BrainIcon size={16} />
                        <span>AI Summary</span>
                    </div>
                    <p className="ai-report__summary">
                        {data.summary.slice(0, revealed)}
                        {revealed < data.summary.length && <span className="ai-report__cursor">|</span>}
                    </p>
                </div>

                {/* Tip */}
                {data.tip && (
                    <div className="ai-report__tip">
                        {data.tip}
                    </div>
                )}
            </div>
        </div>
    )
}
