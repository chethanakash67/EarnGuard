const base = 'w-5 h-5'

export const UserIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.5-3 4.5-4.5 8-4.5s6.5 1.5 8 4.5" />
    </svg>
)

export const MapPinIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
    </svg>
)

export const BriefcaseIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
    </svg>
)

export const FlameIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c4 0 6-3.5 6-7.5C18 9 15 6 12 2c-3 4-6 7-6 12.5C6 18.5 8 22 12 22z" />
        <path d="M12 22c2.5-1 3.5-3 3.5-5" />
    </svg>
)

export const CheckCircleIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
)

export const AlertTriangleIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.3 3.5 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3l-7.7-13.5a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4" />
        <circle cx="12" cy="16.5" r="1" />
    </svg>
)

export const ShieldCheckIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V6l-8-3-8 3v6c0 6 8 10 8 10z" />
        <path d="m9 11.5 2.2 2.2L15 10" />
    </svg>
)

export const SunIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5 19 19M5 19l-1.5 1.5M20.5 3.5 19 5" />
    </svg>
)

export const CloudSunIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6.5" cy="8.5" r="2.5" />
        <path d="M6.5 2v1.5M6.5 13v1.5M1 8.5h1.5M10.5 8.5H12M2.9 4.9l1.1 1.1M9 12l1 1M2.9 12.1l1.1-1.1" />
        <path d="M10 11a4.5 4.5 0 0 1 8.7 1H19a3 3 0 0 1 0 6H11.5a3.5 3.5 0 1 1 0-7c.3 0 .6 0 .9.07" />
    </svg>
)

export const CloudIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 18.5a4.5 4.5 0 0 1 .6-9 5.5 5.5 0 0 1 10.7 1.5h.7a3.5 3.5 0 1 1 0 7H7.5a1 1 0 0 1-1-1z" />
    </svg>
)

export const CloudRainIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 17.5a4.5 4.5 0 0 1 .6-9 5.5 5.5 0 0 1 10.7 1.5h.7a3.5 3.5 0 1 1 0 7H7.5a1 1 0 0 1-1-1z" />
        <path d="M9 19v2M13 19v2M17 19v2" />
    </svg>
)

export const CloudLightningIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 17.5a4.5 4.5 0 0 1 .6-9 5.5 5.5 0 0 1 10.7 1.5h.7a3.5 3.5 0 1 1 0 7H7.5a1 1 0 0 1-1-1z" />
        <path d="m11 14-2 4h3l-1 4 4-6h-3l1-2z" />
    </svg>
)

export const DropletIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3s6 6.2 6 11a6 6 0 1 1-12 0c0-4.8 6-11 6-11z" />
    </svg>
)

export const ArrowRightIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
    </svg>
)

export const SparkleIcon = ({ className = base }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5z" />
    </svg>
)

export default {
    UserIcon,
    MapPinIcon,
    BriefcaseIcon,
    FlameIcon,
    CheckCircleIcon,
    AlertTriangleIcon,
    ShieldCheckIcon,
    SunIcon,
    CloudSunIcon,
    CloudIcon,
    CloudRainIcon,
    CloudLightningIcon,
    DropletIcon,
    ArrowRightIcon,
    SparkleIcon,
}
