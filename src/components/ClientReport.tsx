import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { ClientProfile } from '../types'
import { PORTFOLIOS } from '../data/funds'
import { sipProjection, formatINR } from '../utils/calculations'
import { Card, SectionTitle, YearlyTable } from './ui'

const COLORS = ['#0a1530', '#c4943a', '#2c4f9e', '#d9ad4a', '#162a5c']

export function ClientReport({ profile }: { profile: ClientProfile }) {
  const sip = Number(profile.monthlySip) || 0
  const years = Number(profile.durationYears) || 0
  const allocation = PORTFOLIOS[profile.riskProfile]
  const projection = useMemo(
    () => (sip > 0 && years > 0 ? sipProjection(sip, 12, years) : null),
    [sip, years]
  )

  const pieData = allocation.map((a) => ({ name: a.fund, value: a.percent }))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print">
        <p className="text-sm text-navy-700/60">
          This report mirrors what prints — use your browser's print dialog to save as PDF.
        </p>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-navy-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-800 transition-colors"
        >
          Print / save as PDF
        </button>
      </div>

      <Card className="print-area max-w-3xl mx-auto">
        <div className="flex items-center justify-between border-b border-navy-900/10 pb-4 mb-6">
          <div>
            <p className="font-display text-xl text-navy-900">WealthTogether Investments</p>
            <p className="text-xs text-gold-600 uppercase tracking-wide">
              Invest Early. Stay Consistent. Let Time Build Wealth.
            </p>
          </div>
          <p className="text-xs text-navy-700/50">{new Date().toLocaleDateString('en-IN')}</p>
        </div>

        <SectionTitle eyebrow="Module 09" title="Client Investment Report" />

        <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
          <Detail label="Client name" value={profile.name || '—'} />
          <Detail label="Age" value={profile.age ? `${profile.age} yrs` : '—'} />
          <Detail label="Risk profile" value={profile.riskProfile} />
          <Detail
            label="Monthly SIP"
            value={sip ? `₹${sip.toLocaleString('en-IN')}` : '—'}
          />
        </div>

        <h3 className="font-display text-lg text-navy-900 mb-3">Recommended portfolio</h3>
        <div className="grid sm:grid-cols-2 gap-4 items-center mb-8">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="text-sm space-y-2">
            {allocation.map((a, i) => (
              <li key={a.fund} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-navy-800">{a.fund}</span>
                <span className="ml-auto font-mono-num text-navy-700">{a.percent}%</span>
              </li>
            ))}
          </ul>
        </div>

        {projection ? (
          <>
            <h3 className="font-display text-lg text-navy-900 mb-3">
              SIP projection ({years} years @ 12% p.a.)
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <Detail label="Total invested" value={formatINR(projection.totalInvested)} />
              <Detail label="Estimated corpus" value={formatINR(projection.corpus)} />
              <Detail label="Wealth created" value={formatINR(projection.wealthCreated)} />
            </div>
            <YearlyTable rows={projection.rows} />
          </>
        ) : (
          <p className="text-sm text-navy-700/60 mb-6">
            Add a monthly SIP and duration in the Client Profiler to include a projection.
          </p>
        )}

        <p className="text-[11px] text-navy-700/50 mt-8 border-t border-navy-900/10 pt-4 leading-relaxed">
          Disclaimer: Mutual fund investments are subject to market risk. Past performance is not
          indicative of future returns. Projections shown are illustrative, assume a constant rate
          of return, and are not a guarantee of actual performance. Please read all scheme-related
          documents carefully before investing. WealthTogether Investments is an AMFI-registered
          mutual fund distributor and does not provide investment advice as defined under SEBI
          (Investment Advisers) Regulations.
        </p>
      </Card>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-navy-700/50">{label}</p>
      <p className="font-medium text-navy-900">{value}</p>
    </div>
  )
}
