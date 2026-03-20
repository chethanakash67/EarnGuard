import { ArrowRightIcon, ShieldCheckIcon, CheckCircleIcon, BriefcaseIcon, DropletIcon } from './Icons'
import DemoButton from './DemoButton'

export default function Landing({ onStart, onResume, hasUser }) {
    return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.12),transparent_45%)]" />

            <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-bold">
                    <ShieldCheckIcon className="w-6 h-6 text-[#22c55e]" />
                    EarnGuard
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200" onClick={onStart}>Start protection</button>
                    {hasUser && (
                        <button className="text-sm font-semibold px-3 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15" onClick={onResume}>Go to dashboard</button>
                    )}
                    <DemoButton />
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pb-14">
                <section className="grid lg:grid-cols-2 gap-12 items-center pt-6">
                    <div className="space-y-5">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Weather-linked income protection for gig and independent workers.</h1>
                        <p className="text-lg text-[#b3b3b3] max-w-2xl">Stay covered when rain or storms slow your earnings. Quick activation, transparent pricing, and clear upgrade paths to keep payouts maximized.</p>
                        <div className="space-y-3 text-sm text-[#d1d5db]">
                            <Bullet icon={<CheckCircleIcon className="w-4 h-4 text-[#22c55e]" />} text="Activate in under 2 minutes—no paperwork" />
                            <Bullet icon={<CheckCircleIcon className="w-4 h-4 text-[#22c55e]" />} text="Coverage suggestions based on your job and city" />
                            <Bullet icon={<CheckCircleIcon className="w-4 h-4 text-[#22c55e]" />} text="Upgrade nudges so income never exceeds your cap" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button className="px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200" onClick={onStart}>Start now</button>
                            <button className="px-5 py-3 rounded-xl bg-[#121212] border border-[#1f1f1f] text-white font-semibold hover:border-[#2a2a2a]" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>See how it works</button>
                        </div>
                        <div className="text-xs text-[#9ca3af]">Trusted by delivery, driving, and freelance earners in major cities.</div>
                    </div>

                    <div className="relative">
                        <div className="relative bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-sm text-[#9ca3af]"><ShieldCheckIcon className="w-4 h-4" /> Current cover preview</div>
                                <span className="text-[11px] font-semibold text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full px-2 py-0.5">Live example</span>
                            </div>
                            <div className="space-y-3">
                                <InfoRow label="Weekly price" value="₹399" />
                                <InfoRow label="Income covered" value="80% up to ₹25,000/week" />
                                <InfoRow label="Projected payout" value="₹12,400" accent />
                                <div className="rounded-xl bg-[#121212] border border-[#1f1f1f] p-3">
                                    <div className="text-xs text-[#9ca3af] mb-2">Upgrade suggestion</div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-white font-semibold">Move to Elite for higher ceiling</div>
                                            <div className="text-xs text-[#9ca3af]">90% cover up to ₹50,000/week</div>
                                        </div>
                                        <button className="px-3 py-2 text-sm font-semibold bg-white text-black rounded-lg hover:bg-gray-200" onClick={onStart}>Fast-track</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="mt-12 grid md:grid-cols-3 gap-4">
                    <FeatureCard icon={<DropletIcon className="w-5 h-5 text-[#3b82f6]" />} title="Weather smart" desc="Uses forecast and your job type to adjust risk and coverage guidance." />
                    <FeatureCard icon={<BriefcaseIcon className="w-5 h-5 text-[#22c55e]" />} title="Built for workers" desc="Simple onboarding for delivery, drivers, and independent earners." />
                    <FeatureCard icon={<CheckCircleIcon className="w-5 h-5 text-[#f59e0b]" />} title="Profit minded" desc="Upgrade reminders keep your income within protected limits." />
                </section>

                <section className="mt-12 grid md:grid-cols-3 gap-4">
                    <PlanHighlight title="Starter" price="₹99/week" cover="50%" onClick={onStart} />
                    <PlanHighlight title="Pro" price="₹399/week" cover="80%" badge="Popular" featured onClick={onStart} />
                    <PlanHighlight title="Elite" price="₹699/week" cover="90%" onClick={onStart} />
                </section>
            </main>
        </div>
    )
}
function Bullet({ icon, text }) {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <span>{text}</span>
        </div>
    )
}

function InfoRow({ label, value, accent }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-[#9ca3af]">{label}</span>
            <span className={`font-semibold ${accent ? 'text-[#22c55e]' : 'text-white'}`}>{value}</span>
        </div>
    )
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f]">
            <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#1f1f1f] flex items-center justify-center mb-3">{icon}</div>
            <div className="text-white font-semibold mb-1">{title}</div>
            <div className="text-sm text-[#9ca3af] leading-relaxed">{desc}</div>
        </div>
    )
}

function PlanHighlight({ title, price, cover, badge, featured, onClick }) {
    return (
        <div className={`p-5 rounded-2xl border ${featured ? 'bg-[#111] border-[#22c55e]/50 shadow-[0_12px_40px_rgba(0,0,0,0.35)]' : 'bg-[#0f0f0f] border-[#1f1f1f]'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">{title}</div>
                {badge && <span className={`text-[11px] uppercase tracking-wide px-3 py-1 rounded-full ${featured ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/40' : 'bg-white/5 text-[#9ca3af] border border-white/10'}`}>{badge}</span>}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{price}</div>
            <div className="text-sm text-[#9ca3af] mb-4">Income cover up to {cover}</div>
            <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${featured ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#111] border border-[#1f1f1f] hover:border-[#22c55e]/40'}`} onClick={onClick}>
                Choose {title}
            </button>
        </div>
    )
}
