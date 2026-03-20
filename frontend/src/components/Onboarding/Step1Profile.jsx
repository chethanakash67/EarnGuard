import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { JOB_TYPES } from '../../constants/plans'

export default function Step1Profile({ data, onChange, onNext }) {
    const { t } = useLang()
    const [form, setForm] = useState({
        name: data.name || '',
        jobType: data.jobType || '',
        city: data.city || '',
    })

    const valid = form.name.trim() && form.jobType && form.city.trim()

    const handleNext = () => {
        if (valid) { onChange(form); onNext() }
    }

    return (
        <div className="animate-[fadeIn_0.4s_ease]">
            <h2 className="text-2xl font-bold text-white mb-1">{t('step1Title')}</h2>
            <p className="text-[#9ca3af] text-sm mb-8">{t('step1Desc')}</p>

            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">{t('name')}</label>
                    <input
                        className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white outline-none focus:border-[#3a3a3a] transition-colors duration-300"
                        placeholder={t('namePh')} value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">{t('jobType')}</label>
                    <select
                        className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white outline-none focus:border-[#3a3a3a] transition-colors duration-300 appearance-none"
                        value={form.jobType}
                        onChange={e => setForm({ ...form, jobType: e.target.value })}
                    >
                        <option value="" disabled>{t('selectJob')}</option>
                        {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">{t('city')}</label>
                    <input
                        className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white outline-none focus:border-[#3a3a3a] transition-colors duration-300"
                        placeholder={t('cityPh')} value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                    />
                </div>
            </div>

            <button
                className="w-full mt-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!valid} onClick={handleNext}
            >{t('next')}</button>
        </div>
    )
}
