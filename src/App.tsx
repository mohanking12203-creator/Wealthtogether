import React, { useState } from 'react'
import type { ClientProfile, Fund } from './types'
import { INITIAL_FUNDS } from './data/funds'
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

const TABS = [
  { id: 'profiler', label: 'Client Profiler' },
  { id: 'portfolio', label: 'Portfolio Engine' },
  { id: 'sip', label: 'SIP Projection' },
  { id: 'stepup', label: 'Step-Up SIP' },
  { id: 'retirement', label: 'Retirement' },
  { id: 'education', label: 'Child Education' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'aum', label: 'AUM Tracker' },
  { id: 'report', label: 'Client Report' },
  { id: 'admin', label: 'Admin Panel' },
] as const

type TabId = typeof TABS[number]['id']

export default function App() {
  const [tab, setTab] = useState<TabId>('profiler')
  const [profile, setProfile] = useState<ClientProfile>({
    name: '',
    age: '',
    monthlySip: '',
    riskProfile: 'Moderate',
    durationYears: '',
  })
  const [funds, setFunds] = useState<Fund[]>(INITIAL_FUNDS)

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
        <nav className="border-t border-white/10 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 flex gap-1 text-sm">
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
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {tab === 'profiler' && (
          <ClientProfiler
            profile={profile}
            setProfile={setProfile}
            onGenerate={() => setTab('portfolio')}
          />
        )}
        {tab === 'portfolio' && <PortfolioEngine profile={profile} />}
        {tab === 'sip' && <SipCalculator profile={profile} />}
        {tab === 'stepup' && <StepUpSipCalculator profile={profile} />}
        {tab === 'retirement' && <RetirementCalculator profile={profile} />}
        {tab === 'education' && <ChildEducationCalculator profile={profile} />}
        {tab === 'insurance' && <InsuranceCalculator />}
        {tab === 'aum' && <AumTracker />}
        {tab === 'report' && <ClientReport profile={profile} />}
        {tab === 'admin' && <AdminPanel funds={funds} setFunds={setFunds} />}
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
