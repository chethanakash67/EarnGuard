const rawApiBase = import.meta.env.VITE_API_BASE_URL || ''

export const API_BASE_URL = rawApiBase.replace(/\/+$/, '')

export function apiUrl(path) {
    return `${API_BASE_URL}${path}`
}
