import React, { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { sipProjection, stepUpSipProjection, xirrApprox, formatINR, getRiskReturnAssumption } from '../utils/calculations'
import type { ClientProfile } from '../types'
import { Card, Field, NumberInput, SectionTitle, StatTile, YearlyTable } from './ui'

export function SipCalculator({ profile }: { profile: ClientProfile }) {
  const [monthlySip, setMonthlySip] = useState<number | ''>(10000)
  const [years, setYears] = useState<number | ''>(15)

  const riskReturn = getRiskReturnAssumption(profile.riskProfile)

  const result = useMemo(() => {
    const m = Number(monthlySip) || 0
    const y = Number(years) || 0
    if (m <= 0 || y <= 0) return null
    const proj = sipProjection(m, riskReturn, y)
    const xirr = xirrApprox(m, y, proj.corpus)
    return { ...proj, xirr }
  }, [monthlySip, years, riskReturn])

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 03"
        title="SIP Projection Calculator"
        description="Monthly-compounding future value of a level SIP, with a year-by-year growth table."
      />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Field label="Monthly SIP">
          <NumberInput value={monthlySip} onChange={setMonthlySip} suffix="₹" />
        </Field>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-navy-700/50">Expected return</p>
          <p className="mt-1 text-2xl font-semibold text-navy-900">{riskReturn}%</p>
          <p className="mt-1 text-xs text-navy-700/60">Based on {profile.riskProfile} risk profile</p>
        </div>
        <Field label="Investment years">
          <NumberInput value={years} onChange={setYears} suffix="yrs" />
        </Field>
      </div>

      {result ? (
        <>
          <div className="grid sm:grid-cols-4 gap-3 mb-6">
            <StatTile label="Total invested" value={formatINR(result.totalInvested)} />
            <StatTile label="Estimated corpus" value={formatINR(result.corpus)} accent />
            <StatTile label="Wealth created" value={formatINR(result.wealthCreated)} />
            <StatTile label="XIRR approx." value={`${result.xirr}%`} />
          </div>

          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.rows}>
                <defs>
                  <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c4943a" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#c4943a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0a153014" />
                <XAxis dataKey="year" tickLine={false} stroke="#0a153066" fontSize={12} />
                <YAxis
                  tickLine={false}
                  stroke="#0a153066"
                  fontSize={12}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(v: number) => formatINR(v)}
                  labelFormatter={(l) => `Year ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0a1530"
                  fill="url(#sipGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <YearlyTable rows={result.rows} />
        </>
      ) : (
        <p className="text-sm text-navy-700/60">Enter SIP, return and years to see projections.</p>
      )}
    </Card>
  )
}

export function StepUpSipCalculator({ profile }: { profile: ClientProfile }) {
  const [monthlySip, setMonthlySip] = useState<number | ''>(10000)
  const [stepUp, setStepUp] = useState<number | ''>(10)
  const [years, setYears] = useState<number | ''>(15)

  const riskReturn = getRiskReturnAssumption(profile.riskProfile)

  const result = useMemo(() => {
    const m = Number(monthlySip) || 0
    const s = Number(stepUp) || 0
    const y = Number(years) || 0
    if (m <= 0 || y <= 0) return null
    return stepUpSipProjection(m, s, riskReturn, y)
  }, [monthlySip, stepUp, years, riskReturn])

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 04"
        title="Step-Up SIP Calculator"
        description="Contribution rises every year by the chosen step-up percentage, compounding monthly on top of growth."
      />
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Field label="Starting monthly SIP">
          <NumberInput value={monthlySip} onChange={setMonthlySip} suffix="₹" />
        </Field>
        <Field label="Annual step-up">
          <NumberInput value={stepUp} onChange={setStepUp} suffix="%" />
        </Field>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-navy-700/50">Expected return</p>
          <p className="mt-1 text-2xl font-semibold text-navy-900">{riskReturn}%</p>
          <p className="mt-1 text-xs text-navy-700/60">Based on {profile.riskProfile} risk profile</p>
        </div>
        <Field label="Years">
          <NumberInput value={years} onChange={setYears} suffix="yrs" />
        </Field>
      </div>

      {result ? (
        <>
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            <StatTile label="Total invested" value={formatINR(result.totalInvested)} />
            <StatTile label="Future value" value={formatINR(result.corpus)} accent />
            <StatTile label="Wealth created" value={formatINR(result.wealthCreated)} />
          </div>
          <YearlyTable rows={result.rows} />
        </>
      ) : (
        <p className="text-sm text-navy-700/60">Enter SIP, step-up, return and years to see the table.</p>
      )}
    </Card>
  )
}
