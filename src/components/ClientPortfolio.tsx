import React, { useMemo, useState } from 'react'
import type { ClientProfile, RiskProfile } from '../types'
import { PORTFOLIOS } from '../data/funds'
import { validateFundAllocation } from '../utils/calculations'
import { Card, Field, NumberInput, SectionTitle, inputClass } from './ui'

const RISK_OPTIONS: RiskProfile[] = ['Low', 'Moderate', 'High']

export function ClientProfiler({
  profile,
  setProfile,
  onGenerate,
}: {
  profile: ClientProfile
  setProfile: (p: ClientProfile) => void
  onGenerate: () => void
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <SectionTitle
          eyebrow="Module 01"
          title="Client Profiler"
          description="Capture the basics. Everything downstream — portfolio mix, projections, the report — reads from this one profile."
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Client name">
            <input
              className={inputClass}
              value={profile.name}
              placeholder="e.g. Anjali Rao"
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </Field>
          <Field label="Age">
            <NumberInput
              value={profile.age}
              onChange={(v) => setProfile({ ...profile, age: v })}
              placeholder="32"
              suffix="yrs"
            />
          </Field>
          <Field label="Monthly SIP amount">
            <NumberInput
              value={profile.monthlySip}
              onChange={(v) => setProfile({ ...profile, monthlySip: v })}
              placeholder="10000"
              suffix="₹"
            />
          </Field>
          <Field label="Investment duration">
            <NumberInput
              value={profile.durationYears}
              onChange={(v) => setProfile({ ...profile, durationYears: v })}
              placeholder="15"
              suffix="yrs"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Risk profile">
              <div className="grid grid-cols-3 gap-2">
                {RISK_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setProfile({ ...profile, riskProfile: r })}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      profile.riskProfile === r
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-navy-700 border-navy-900/15 hover:border-gold-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>
        <button
          onClick={onGenerate}
          className="mt-6 w-full sm:w-auto rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold px-6 py-3 transition-colors"
        >
          Generate recommendation
        </button>
      </Card>

      <Card>
        <p className="font-mono-num text-xs tracking-[0.18em] uppercase text-gold-600">
          Profile snapshot
        </p>
        <div className="mt-4 space-y-3 text-sm">
          <Row label="Name" value={profile.name || '—'} />
          <Row label="Age" value={profile.age ? `${profile.age} yrs` : '—'} />
          <Row label="Risk profile" value={profile.riskProfile} />
          <Row
            label="Monthly SIP"
            value={profile.monthlySip ? `₹${Number(profile.monthlySip).toLocaleString('en-IN')}` : '—'}
          />
          <Row
            label="Duration"
            value={profile.durationYears ? `${profile.durationYears} yrs` : '—'}
          />
        </div>
      </Card>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-navy-900/5 pb-2">
      <span className="text-navy-700/60">{label}</span>
      <span className="font-medium text-navy-900">{value}</span>
    </div>
  )
}

export function PortfolioEngine({ profile }: { profile: ClientProfile }) {
  const sip = Number(profile.monthlySip) || 0
  const allocation = useMemo(() => PORTFOLIOS[profile.riskProfile], [profile.riskProfile])
  const { validatedAllocations, warning } = useMemo(
    () => validateFundAllocation(allocation, sip),
    [allocation, sip]
  )

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 02"
        title="WealthTogether Portfolio Engine"
        description={`Model fund mix for a ${profile.riskProfile.toLowerCase()}-risk client, split across the SIP amount entered in the profiler.`}
      />
      {sip <= 0 && (
        <p className="text-sm text-navy-700/60 mb-4">
          Enter a monthly SIP amount in the Client Profiler to see rupee-level allocation.
        </p>
      )}
      {warning && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {warning}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-navy-900/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-900 text-gold-100 text-left">
              <th className="px-4 py-2.5 font-medium">Fund</th>
              <th className="px-4 py-2.5 font-medium">Allocation %</th>
              <th className="px-4 py-2.5 font-medium">Monthly Amount</th>
            </tr>
          </thead>
          <tbody>
            {validatedAllocations.map((a, i) => (
              <tr key={a.fund} className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50/40'}>
                <td className="px-4 py-2.5 text-navy-900 font-medium">{a.fund}</td>
                <td className="px-4 py-2.5 font-mono-num text-navy-700">{a.percent}%</td>
                <td className="px-4 py-2.5 font-mono-num text-navy-900">
                  ₹{a.monthlyAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-navy-900/10">
              <td className="px-4 py-2.5 font-semibold text-navy-900">Total</td>
              <td className="px-4 py-2.5 font-mono-num font-semibold">100%</td>
              <td className="px-4 py-2.5 font-mono-num font-semibold">
                ₹{sip.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}
