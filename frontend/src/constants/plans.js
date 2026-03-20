// EarnGuard V2 – Plan Definitions (frontend mirror)
export const PLANS = [
    {
        id: 'starter', name: 'Starter', maxIncome: 5000,
        weeklyPrice: 99, monthlyPrice: 349, coverage: 50,
        benefit: 'Basic weather protection for part-time gig workers',
    },
    {
        id: 'basic', name: 'Basic', maxIncome: 10000,
        weeklyPrice: 179, monthlyPrice: 649, coverage: 60,
        benefit: 'Enhanced coverage for regular gig workers',
    },
    {
        id: 'standard', name: 'Standard', maxIncome: 15000,
        weeklyPrice: 249, monthlyPrice: 899, coverage: 70,
        benefit: 'Full protection with 70% income coverage',
    },
    {
        id: 'pro', name: 'Pro', maxIncome: 25000,
        weeklyPrice: 399, monthlyPrice: 1449, coverage: 80,
        popular: true,
        benefit: 'Most popular — 80% coverage for serious earners',
    },
    {
        id: 'elite', name: 'Elite', maxIncome: 50000,
        weeklyPrice: 699, monthlyPrice: 2499, coverage: 90,
        benefit: 'Maximum 90% coverage for top earners',
    },
    {
        id: 'custom', name: 'Custom', maxIncome: null,
        weeklyPrice: null, monthlyPrice: null, coverage: 70,
        benefit: 'Flexible plan — set your own income level',
    },
]

export const JOB_TYPES = [
    'Delivery', 'Driver', 'Freelancer', 'Auto Driver', 'Construction Worker',
]

export function getPlanById(id) {
    return PLANS.find(p => p.id === id)
}

export function getCustomPrice(income, billing = 'weekly') {
    if (billing === 'monthly') return Math.round(income * 0.14)
    return Math.round(income * 0.04)
}

export function getNextPlan(currentId) {
    const order = ['starter', 'basic', 'standard', 'pro', 'elite']
    const idx = order.indexOf(currentId)
    if (idx >= 0 && idx < order.length - 1) return PLANS.find(p => p.id === order[idx + 1])
    return null
}
