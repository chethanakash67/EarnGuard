import { useState } from 'react'
import { t } from '../i18n'

export default function InputForm({ onSubmit, onDemo, lang = 'en', defaultData = {} }) {
    const [name, setName] = useState(defaultData.name || '')
    const [jobType, setJobType] = useState(defaultData.jobType || '')
    const [income, setIncome] = useState(defaultData.income || '')
    const [tier, setTier] = useState(defaultData.tier || 'pro')

    const isValid = name.trim() && jobType && income && Number(income) > 0

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isValid) return
        onSubmit({
            name: name.trim(),
            job_type: jobType,
            expected_income: Number(income),
            tier,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="card" style={{ animation: 'slideUp 0.5s ease' }}>
            <div className="form-group">
                <label className="form-label" htmlFor="name">{t('fullName', lang)}</label>
                <input
                    id="name"
                    className="form-input"
                    type="text"
                    placeholder={t('namePlaceholder', lang)}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="jobType">{t('jobType', lang)}</label>
                <select
                    id="jobType"
                    className="form-select"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                >
                    <option value="" disabled>{t('selectGigType', lang)}</option>
                    <option value="Delivery">{t('delivery', lang)}</option>
                    <option value="Driver">{t('driver', lang)}</option>
                    <option value="Freelancer">{t('freelancer', lang)}</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="income">{t('expectedWeeklyIncome', lang)}</label>
                <div className="form-input-wrapper">
                    <span className="form-input-prefix">₹</span>
                    <input
                        id="income"
                        className="form-input form-input--with-prefix"
                        type="number"
                        placeholder="5000"
                        min="1"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                    />
                </div>
            </div>

            {/* Tier Toggle */}
            <div className="form-group">
                <label className="form-label">{t('coverageTier', lang)}</label>
                <div className="tier-toggle tier-toggle--inline">
                    <button
                        type="button"
                        className={`tier-option tier-option--small ${tier === 'basic' ? 'tier-option--active' : ''}`}
                        onClick={() => setTier('basic')}
                    >
                        <span className="tier-option__name">{t('basic', lang)}</span>
                        <span className="tier-option__desc">{t('basicDesc', lang)}</span>
                    </button>
                    <button
                        type="button"
                        className={`tier-option tier-option--small ${tier === 'pro' ? 'tier-option--active' : ''}`}
                        onClick={() => setTier('pro')}
                    >
                        <span className="tier-option__name">{t('pro', lang)}</span>
                        <span className="tier-option__desc">{t('proDesc', lang)}</span>
                    </button>
                </div>
            </div>

            <button type="submit" className="btn btn--primary" disabled={!isValid}>
                {t('analyzeRisk', lang)}
            </button>

            {/* Auto Demo button */}
            {onDemo && (
                <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => onDemo({ name: name || 'Demo User', jobType: jobType || 'Delivery', income: income || '5000', tier })}
                    style={{ marginTop: 8 }}
                >
                    {t('runDemo', lang)}
                </button>
            )}
        </form>
    )
}
