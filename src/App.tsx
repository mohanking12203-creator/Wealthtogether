import React, { useEffect, useMemo, useState } from 'react'
import type { ClientProfile, DebtReportSummary, Fund, Lead } from './types'
import { INITIAL_FUNDS } from './data/funds'
import { getStoredLeads, saveLeadsToStorage } from './utils/leadStorage'
import { ClientProfiler, PortfolioEngine } from './components/ClientPortfolio'
import { SipCalculator, StepUpSipCalculator } from './components/SipCalculators'
import {
  RetirementCalculator,
  ChildEducationCalculator,
  InsuranceCalculator,
  AumTracker,
} from './components/PlanningModules'
import { ClientReport } from './components/ClientReport'
import { AdminPanel } from './components/AdminPanel'
import { LeadCapture } from './components/LeadCapture'
import { LeadAdmin } from './components/LeadAdmin'
import { FinancialHealth } from './components/FinancialHealth'
import { DebtFreedomPlanner } from './components/DebtFreedomPlanner'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'planner', label: 'Investment Planner' },
  { id: 'goals', label: 'Goal Planning' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'reports', label: 'Reports' },
  { id: 'debt', label: 'Debt Freedom' },
  { id: 'crm', label: 'CRM' },
] as const

const SUB_TABS: Record<string, { id: string; label: string }[]> = {
  dashboard: [
    { id: 'profiler', label: 'Client Profiler' },
    { id: 'aum', label: 'AUM Tracker' },
    { id: 'health', label: 'Health Score' },
  ],
  planner: [
    { id: 'portfolio', label: 'Portfolio Engine' },
    { id: 'sip', label: 'SIP Projection' },
    { id: 'stepup', label: 'Step-Up SIP' },
  ],
  goals: [
    { id: 'retirement', label: 'Retirement' },
    { id: 'education', label: 'Child Education' },
  ],
  insurance: [{ id: 'insurance', label: 'Insurance Solutions' }],
  reports: [
    { id: 'report', label: 'Client Report' },
    { id: 'pdf', label: 'PDF Downloads' },
  ],
  debt: [{ id: 'planner', label: 'Debt Freedom Planner' }],
  crm: [
    { id: 'book', label: 'Book Consultation' },
    { id: 'leads', label: 'Admin Leads' },
    { id: 'admin', label: 'Admin Panel' },
  ],
}

const DEFAULT_SECTION: Record<string, string> = {
  dashboard: 'profiler',
  planner: 'portfolio',
  goals: 'retirement',
  insurance: 'insurance',
  reports: 'report',
  debt: 'planner',
  crm: 'book',
}

type TabId = typeof TABS[number]['id']

export default function App() {
  const [tab, setTab] = useState<TabId>('dashboard')
  const [section, setSection] = useState(DEFAULT_SECTION['dashboard'])
  const [profile, setProfile] = useState<ClientProfile>({
    name: '',
    age: '',
    monthlySip: '',
    riskProfile: 'Moderate',
    durationYears: '',
  })
  const [funds, setFunds] = useState<Fund[]>(INITIAL_FUNDS)
  const [leads, setLeads] = useState<Lead[]>([])
  const [debtSummary, setDebtSummary] = useState<DebtReportSummary | null>(null)

  useEffect(() => {
    setLeads(getStoredLeads())
  }, [])

  useEffect(() => {
    setSection(DEFAULT_SECTION[tab])
  }, [tab])

  const leadSummary = useMemo(
    () => ({
      total: leads.length,
      sipPotential: leads.reduce((sum, lead) => sum + Number(lead.monthlySip || 0), 0),
    }),
    [leads]
  )

  const saveLead = (lead: Lead) => {
    setLeads((currentLeads) => {
      const nextLeads = [lead, ...currentLeads]
      saveLeadsToStorage(nextLeads)
      return nextLeads
    })
  }

  const handleBookConsultationFromDebt = () => {
    setTab('crm')
    setSection('book')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,#f7f4ea_0%,#f7f5ef_40%,#f5f7fb_100%)]">
      <header className="sticky top-0 z-40 bg-navy-950/95 text-white no-print shadow-lg shadow-navy-950/15 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-base font-bold text-navy-950 shadow-sm">
                WT
              </div>
              <div>
                <p className="font-display text-xl leading-tight">WealthTogether Investments</p>
                <p className="text-[11px] text-gold-300 uppercase tracking-[0.18em]">
                  Invest Early • Stay Consistent • Let Time Build Wealth
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="hidden rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-100 sm:inline-flex">
                Financial Planning Dashboard
              </span>
              <div className="ledger-rule hidden md:block w-24" />
            </div>
          </div>
        </div>
        <nav className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="flex items-center justify-between gap-3 py-3 sm:hidden">
              <label className="text-sm font-medium text-white">Menu</label>
              <select
                className="min-w-[140px] rounded-full border border-white/20 bg-navy-950/90 px-3 py-2 text-sm text-white"
                value={tab}
                onChange={(e) => setTab(e.target.value as TabId)}
              >
                {TABS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:flex gap-1 text-sm overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`whitespace-nowrap px-3.5 py-3 border-b-2 transition-colors ${
                    tab === t.id
                      ? 'border-gold-500 text-gold-300'
                      : 'border-transparent text-white/60 hover:text-white'
                  }`}
                >
                  {t.id === 'crm' && leadSummary.total > 0 ? (
                    <span className="inline-flex items-center gap-2">
                      {t.label}
                      <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[11px] font-semibold text-navy-950">
                        {leadSummary.total}
                      </span>
                    </span>
                  ) : (
                    t.label
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {tab === 'crm' && leadSummary.total > 0 && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-navy-900/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gold-600">CRM leads</p>
              <p className="mt-3 text-3xl font-semibold text-navy-900">{leadSummary.total}</p>
              <p className="mt-1 text-sm text-navy-700/80">Captured consultation leads</p>
            </div>
            <div className="rounded-3xl border border-navy-900/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Monthly SIP potential</p>
              <p className="mt-3 text-3xl font-semibold text-navy-900">₹{leadSummary.sipPotential.toLocaleString('en-IN')}</p>
              <p className="mt-1 text-sm text-navy-700/80">Current lead pipeline value</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-navy-900/10 bg-white px-4 py-3 shadow-sm sm:px-5">
            <div className="text-sm font-semibold text-navy-900">{TABS.find((item) => item.id === tab)?.label}</div>
            <div className="sm:hidden">
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="rounded-full border border-navy-900/15 bg-white px-3 py-2 text-sm text-navy-900"
              >
                {SUB_TABS[tab].map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 hidden gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-4">
            {SUB_TABS[tab].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSection(sub.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  section === sub.id
                    ? 'border-gold-500 bg-gold-500/10 text-gold-700'
                    : 'border-navy-900/10 bg-white text-navy-900 hover:border-gold-300'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'dashboard' && section === 'profiler' && (
          <ClientProfiler
            profile={profile}
            setProfile={setProfile}
            onGenerate={() => {
              setTab('planner')
              setSection('portfolio')
            }}
          />
        )}
        {tab === 'dashboard' && section === 'aum' && <AumTracker />}
        {tab === 'dashboard' && section === 'health' && <FinancialHealth />}

        {tab === 'planner' && section === 'portfolio' && <PortfolioEngine profile={profile} />}
        {tab === 'planner' && section === 'sip' && <SipCalculator profile={profile} />}
        {tab === 'planner' && section === 'stepup' && <StepUpSipCalculator profile={profile} />}

        {tab === 'goals' && section === 'retirement' && <RetirementCalculator profile={profile} />}
        {tab === 'goals' && section === 'education' && <ChildEducationCalculator profile={profile} />}

        {tab === 'insurance' && <InsuranceCalculator />}

        {tab === 'reports' && section === 'report' && <ClientReport profile={profile} debtSummary={debtSummary} />}
        {tab === 'reports' && section === 'pdf' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-navy-900/10 bg-gold-50/80 p-5 text-navy-900 shadow-sm">
              <p className="text-sm font-semibold">PDF Downloads</p>
              <p className="mt-2 text-sm text-navy-700/85">
                Use the report page to preview the client outcome and download a polished PDF.
              </p>
            </div>
            <ClientReport profile={profile} debtSummary={debtSummary} />
          </div>
        )}

        {tab === 'debt' && section === 'planner' && (
          <DebtFreedomPlanner
            onDebtSummaryChange={setDebtSummary}
            onBookConsultation={handleBookConsultationFromDebt}
          />
        )}

        {tab === 'crm' && section === 'book' && <LeadCapture onSaveLead={saveLead} />}
        {tab === 'crm' && section === 'leads' && <LeadAdmin leads={leads} />}
        {tab === 'crm' && section === 'admin' && <AdminPanel funds={funds} setFunds={setFunds} />}
      </main>

      <footer className="no-print border-t border-navy-900/10 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="font-display text-lg text-navy-900">WealthTogether Investments</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gold-600">
            Invest Early • Stay Consistent • Let Time Build Wealth
          </p>
          <p className="mt-2 text-sm text-navy-700/60">
            For illustrative financial planning use only. Not investment advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
