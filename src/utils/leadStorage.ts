import type { Lead } from '../types'

const LEADS_KEY = 'wealthtogether_leads'

export function getStoredLeads(): Lead[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LEADS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item === 'object') as Lead[]
  } catch {
    return []
  }
}

export function saveLeadsToStorage(leads: Lead[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function clearStoredLeads() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LEADS_KEY)
}
