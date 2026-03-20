import { useEffect, useRef } from 'react'
import { useLang } from '../../context/LanguageContext'

const RISK_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' }

export default function RiskMap({ data, userCity }) {
    const { t } = useLang()
    const mapRef = useRef(null)
    const mapInstance = useRef(null)

    useEffect(() => {
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link')
            link.id = 'leaflet-css'
            link.rel = 'stylesheet'
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            document.head.appendChild(link)
        }

        const loadLeaflet = () => new Promise(resolve => {
            if (window.L) return resolve(window.L)
            const s = document.createElement('script')
            s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            s.onload = () => resolve(window.L)
            document.head.appendChild(s)
        })

        loadLeaflet().then(L => {
            if (mapInstance.current || !mapRef.current) return

            const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([20.59, 78.96], 5)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map)

            if (data) {
                data.forEach(city => {
                    const color = RISK_COLORS[city.risk_level]
                    const isUser = city.is_user_city
                    const size = isUser ? 18 : 12

                    const icon = L.divIcon({
                        className: '',
                        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 12px ${color}88;position:relative;${isUser ? '' : ''}" ${isUser ? 'class="pulse-marker"' : ''}></div>`,
                        iconSize: [size, size],
                        iconAnchor: [size / 2, size / 2],
                    })

                    L.marker([city.lat, city.lng], { icon }).addTo(map)
                        .bindPopup(`<div style="text-align:center;font-size:13px;"><strong>${city.name}</strong><br/><span style="color:${color};font-weight:600">${city.risk_level} RISK</span>${city.risk_level === 'HIGH' ? '<br/><span style="color:#22c55e;font-size:11px">Compensation triggered</span>' : ''}</div>`, { closeButton: false })
                })
            }

            mapInstance.current = map
        })

        return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
    }, [data])

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">{t('weatherMap')}</h3>
            <div className="rounded-2xl overflow-hidden border border-[#2a2a2a]">
                <div ref={mapRef} style={{ height: 280, width: '100%', background: '#1a1a1a' }} />
            </div>
            <div className="flex gap-6 mt-3 justify-center">
                {Object.entries(RISK_COLORS).map(([level, color]) => (
                    <div key={level} className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        {level}
                    </div>
                ))}
            </div>
        </div>
    )
}
