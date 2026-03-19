import { useEffect, useRef } from 'react'
import { t } from '../i18n'

// Cities with simulated risk data
const CITIES = [
    { name: 'Mumbai', lat: 19.076, lng: 72.8777, risk: 'HIGH' },
    { name: 'Delhi', lat: 28.6139, lng: 77.209, risk: 'MEDIUM' },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, risk: 'LOW' },
    { name: 'Hyderabad', lat: 17.385, lng: 78.4867, risk: 'HIGH' },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, risk: 'MEDIUM' },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, risk: 'LOW' },
]

const RISK_COLORS = {
    HIGH: '#ff453a',
    MEDIUM: '#ff9f0a',
    LOW: '#30d158',
}

export default function WeatherMap({ lang = 'en' }) {
    const mapRef = useRef(null)
    const mapInstance = useRef(null)

    useEffect(() => {
        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link')
            link.id = 'leaflet-css'
            link.rel = 'stylesheet'
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            document.head.appendChild(link)
        }

        // Load Leaflet JS
        const loadLeaflet = () => {
            return new Promise((resolve) => {
                if (window.L) {
                    resolve(window.L)
                    return
                }
                const script = document.createElement('script')
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
                script.onload = () => resolve(window.L)
                document.head.appendChild(script)
            })
        }

        loadLeaflet().then((L) => {
            if (mapInstance.current) return
            if (!mapRef.current) return

            const map = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false,
            }).setView([20.5937, 78.9629], 5)

            // Dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(map)

            // Add risk markers
            CITIES.forEach((city) => {
                const color = RISK_COLORS[city.risk]

                const icon = L.divIcon({
                    className: 'map-risk-marker',
                    html: `<div style="
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: ${color};
            border: 2px solid rgba(255,255,255,0.3);
            box-shadow: 0 0 12px ${color}88;
          "></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7],
                })

                L.marker([city.lat, city.lng], { icon })
                    .addTo(map)
                    .bindPopup(
                        `<div style="text-align:center;font-family:Inter,sans-serif;color:#fff;background:#1a1a1a;padding:8px 12px;border-radius:8px;border:1px solid #2a2a2a;">
              <strong>${city.name}</strong><br/>
              <span style="color:${color};font-weight:600">${city.risk} RISK</span>
            </div>`,
                        {
                            className: 'dark-popup',
                            closeButton: false,
                        }
                    )
            })

            mapInstance.current = map
        })

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove()
                mapInstance.current = null
            }
        }
    }, [])

    return (
        <div className="weather-map-section">
            <h3 className="section-title">{t('weatherMap', lang)}</h3>
            <div className="weather-map-container">
                <div ref={mapRef} className="weather-map" />
            </div>
            <div className="weather-map-legend">
                {Object.entries(RISK_COLORS).map(([level, color]) => (
                    <div className="weather-map-legend__item" key={level}>
                        <span className="weather-map-legend__dot" style={{ background: color }} />
                        <span>{level}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
