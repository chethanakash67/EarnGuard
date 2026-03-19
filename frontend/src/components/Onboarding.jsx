import { useState } from 'react'
import { t } from '../i18n'
import { ShieldIcon } from './Icons'

const STEPS = [
    { key: 'step1', fields: ['name', 'jobType'] },
    { key: 'step2', fields: ['income'] },
    { key: 'step3', fields: ['tier'] },
]

export default function Onboarding({ onComplete, lang = 'en' }) {
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({
        name: '',
        jobType: '',
        income: '',
        tier: 'pro',
    })

    const current = STEPS[step]
    const progress = ((step + 1) / STEPS.length) * 100

    const canProceed = () => {
        if (step === 0) return formData.name.trim() && formData.jobType
        if (step === 1) return formData.income && Number(formData.income) > 0
        return true
    }

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1)
        } else {
            onComplete(formData)
        }
    }

    const handleSkip = () => {
        onComplete({
            name: 'Demo User',
            jobType: 'Delivery',
            income: '5000',
            tier: 'pro',
        })
    }

    return (
        <div className="onboarding">
            {/* Progress Bar */}
            <div className="onboarding__progress-track">
                <div className="onboarding__progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Step Dots */}
            <div className="onboarding__dots">
                {STEPS.map((_, i) => (
                    <span key={i} className={`onboarding__dot ${i <= step ? 'onboarding__dot--active' : ''}`} />
                ))}
            </div>

            {/* Step Content */}
            <div className="onboarding__content" key={step}>
                <div className="onboarding__icon">
                    <ShieldIcon size={40} />
                </div>
                <h2 className="onboarding__title">
                    {t(`onboardingStep${step + 1}Title`, lang)}
                </h2>
                <p className="onboarding__desc">
                    {t(`onboardingStep${step + 1}Desc`, lang)}
                </p>

                {/* Step 1: Name + Job Type */}
                {step === 0 && (
                    <div className="onboarding__fields">
                        <div className="form-group">
                            <label className="form-label" htmlFor="ob-name">{t('fullName', lang)}</label>
                            <input
                                id="ob-name"
                                className="form-input"
                                type="text"
                                placeholder={t('namePlaceholder', lang)}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="ob-job">{t('jobType', lang)}</label>
                            <select
                                id="ob-job"
                                className="form-select"
                                value={formData.jobType}
                                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                            >
                                <option value="" disabled>{t('selectGigType', lang)}</option>
                                <option value="Delivery">{t('delivery', lang)}</option>
                                <option value="Driver">{t('driver', lang)}</option>
                                <option value="Freelancer">{t('freelancer', lang)}</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 2: Income */}
                {step === 1 && (
                    <div className="onboarding__fields">
                        <div className="form-group">
                            <label className="form-label" htmlFor="ob-income">{t('expectedWeeklyIncome', lang)}</label>
                            <div className="form-input-wrapper">
                                <span className="form-input-prefix">₹</span>
                                <input
                                    id="ob-income"
                                    className="form-input form-input--with-prefix"
                                    type="number"
                                    placeholder="5000"
                                    min="1"
                                    value={formData.income}
                                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Tier */}
                {step === 2 && (
                    <div className="onboarding__fields">
                        <div className="tier-toggle">
                            <button
                                type="button"
                                className={`tier-option ${formData.tier === 'basic' ? 'tier-option--active' : ''}`}
                                onClick={() => setFormData({ ...formData, tier: 'basic' })}
                            >
                                <span className="tier-option__name">{t('basic', lang)}</span>
                                <span className="tier-option__desc">{t('basicDesc', lang)}</span>
                            </button>
                            <button
                                type="button"
                                className={`tier-option ${formData.tier === 'pro' ? 'tier-option--active' : ''}`}
                                onClick={() => setFormData({ ...formData, tier: 'pro' })}
                            >
                                <span className="tier-option__badge">Recommended</span>
                                <span className="tier-option__name">{t('pro', lang)}</span>
                                <span className="tier-option__desc">{t('proDesc', lang)}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="onboarding__actions">
                {step > 0 && (
                    <button className="btn btn--secondary" onClick={() => setStep(step - 1)} style={{ flex: 1 }}>
                        {t('onboardingBack', lang)}
                    </button>
                )}
                <button
                    className="btn btn--primary"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    style={{ flex: 2 }}
                >
                    {step === STEPS.length - 1 ? t('onboardingFinish', lang) : t('onboardingNext', lang)}
                </button>
            </div>

            <button className="onboarding__skip" onClick={handleSkip}>
                {t('onboardingSkip', lang)}
            </button>
        </div>
    )
}
