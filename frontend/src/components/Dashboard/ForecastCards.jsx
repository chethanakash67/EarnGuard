import { useLang } from '../../context/LanguageContext'

const WEATHER_ICONS = {
    Clear: '☀️', 'Partly Cloudy': '⛅', Cloudy: '☁️',
    'Light Rain': '🌧️', 'Heavy Rain': '🌧️', Thunderstorm: '⛈️',
}
const RISK_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' }

export default function ForecastCards({ data }) {
    const { t } = useLang()
    if (!data?.days) return null

    const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">{t('fiveDayForecast')}</h3>

            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
                {data.days.map((day, i) => (
                    <div key={i} className="flex-shrink-0 w-[110px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-3.5 text-center hover:border-[#3a3a3a] transition-colors">
                        <div className="text-xs font-bold text-white uppercase">{day.day_name.slice(0, 3)}</div>
                        <div className="text-[10px] text-[#9ca3af] mb-2">{day.date}</div>
                        <div className="text-2xl mb-1">{WEATHER_ICONS[day.weather.condition] || '☁️'}</div>
                        <div className="text-sm font-semibold text-[#c7c7cc] mb-1">{day.weather.temperature}°</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: RISK_COLORS[day.risk_level] }}>
                            {day.risk_level}
                        </div>
                        {day.estimated_compensation > 0 && (
                            <div className="text-[11px] text-[#22c55e] font-semibold mt-1.5">{fmt(day.estimated_compensation)}</div>
                        )}
                    </div>
                ))}
            </div>

            {data.total_estimated_compensation > 0 && (
                <div className="flex justify-between items-center mt-3 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                    <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">{t('totalEstComp')}</span>
                    <span className="text-lg font-bold text-[#22c55e]">{fmt(data.total_estimated_compensation)}</span>
                </div>
            )}
        </div>
    )
}
