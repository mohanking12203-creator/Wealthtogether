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
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy-950 text-white no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gold-500 flex items-center justify-center font-display text-navy-950 font-bold">
              W
            </div>
            <div>
              <p className="font-display text-lg leading-tight">WealthTogether</p>
              <p className="text-[11px] text-gold-300 uppercase tracking-[0.14em]">
                Invest Early · Stay Consistent · Let Time Build Wealth
              </p>
            </div>
          </div>
          <div className="ledger-rule hidden md:block w-32" />
        </div>
        <nav className="border-t border-white/10 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 text-sm">
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {tab === 'profiler' && (
          <ClientProfiler
            profile={profile}
            setProfile={setProfile}
            onGenerate={() => setTab('portfolio')}
          />
        )}
        {tab === 'portfolio' && <PortfolioEngine profile={profile} />}
        {tab === 'sip' && <SipCalculator />}
        {tab === 'stepup' && <StepUpSipCalculator />}
        {tab === 'retirement' && <RetirementCalculator />}
        {tab === 'education' && <ChildEducationCalculator />}
        {tab === 'insurance' && <InsuranceCalculator />}
        {tab === 'aum' && <AumTracker />}
        {tab === 'report' && <ClientReport profile={profile} />}
        {tab === 'admin' && <AdminPanel funds={funds} setFunds={setFunds} />}
      </main>

      <footer className="no-print border-t border-navy-900/10 py-6 text-center text-xs text-navy-700/50">
        WealthTogether Investments — for illustrative financial planning use only. Not investment advice.
      </footer>
    </div>
  )
}
