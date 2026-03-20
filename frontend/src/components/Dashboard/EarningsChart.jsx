import { useEffect, useRef } from 'react'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { useLang } from '../../context/LanguageContext'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function EarningsChart({ data }) {
    const { t } = useLang()
    const canvasRef = useRef(null)
    const chartRef = useRef(null)

    const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`

    useEffect(() => {
        if (!data?.weeks || !canvasRef.current) return

        if (chartRef.current) chartRef.current.destroy()

        const weeks = data.weeks
        const labels = weeks.map(w => w.week)

        // Actual is ALWAYS capped at expected
        const expectedData = weeks.map(w => w.expected)
        const actualData = weeks.map(w => Math.min(w.actual, w.expected))

        // Color actual bars: green if actual >= expected, red if loss
        const actualColors = weeks.map(w => {
            const act = Math.min(w.actual, w.expected)
            return act < w.expected ? '#ef4444' : '#22c55e'
        })

        chartRef.current = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: t('expected'),
                        data: expectedData,
                        backgroundColor: '#4b5563',
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.6,
                    },
                    {
                        label: t('actual'),
                        data: actualData,
                        backgroundColor: actualColors,
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 800, easing: 'easeOutQuart' },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { color: '#9ca3af', font: { size: 11 }, padding: 16, usePointStyle: true, pointStyle: 'circle' },
                    },
                    tooltip: {
                        backgroundColor: '#1a1a1a',
                        titleColor: '#fff',
                        bodyColor: '#9ca3af',
                        borderColor: '#2a2a2a',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` },
                    },
                },
                scales: {
                    x: { ticks: { color: '#9ca3af', font: { size: 11 } }, grid: { display: false }, border: { display: false } },
                    y: {
                        ticks: { color: '#9ca3af', font: { size: 11 }, callback: v => `₹${(v / 1000).toFixed(0)}k` },
                        grid: { color: '#1a1a1a' },
                        border: { display: false },
                    },
                },
            },
        })

        return () => { if (chartRef.current) chartRef.current.destroy() }
    }, [data, t])

    if (!data) return null

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">{t('earningsHistory')}</h3>

            <div className="flex gap-8 mb-4">
                <div>
                    <div className="text-xl font-bold text-[#22c55e]">{fmt(data.total_compensation)}</div>
                    <div className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-0.5">{t('totalProtected')}</div>
                </div>
                <div>
                    <div className="text-xl font-bold text-white">{data.protected_weeks}/8</div>
                    <div className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-0.5">{t('weeksProtected')}</div>
                </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 chart-wrapper">
                <canvas ref={canvasRef} height="220" />
            </div>
        </div>
    )
}
