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
import { sipProjection, stepUpSipProjection, xirrApprox, formatINR } from '../utils/calculations'
import { Card, Field, NumberInput, SectionTitle, StatTile, YearlyTable } from './ui'

export function SipCalculator() {
  const [monthlySip, setMonthlySip] = useState<number | ''>(10000)
  const [expectedReturn, setExpectedReturn] = useState<number | ''>(12)
  const [years, setYears] = useState<number | ''>(15)

  const result = useMemo(() => {
    const m = Number(monthlySip) || 0
    const r = Number(expectedReturn) || 0
    const y = Number(years) || 0
    if (m <= 0 || y <= 0) return null
    const proj = sipProjection(m, r, y)
    const xirr = xirrApprox(m, y, proj.corpus)
    return { ...proj, xirr }
  }, [monthlySip, expectedReturn, years])

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
        <Field label="Expected return">
          <NumberInput value={expectedReturn} onChange={setExpectedReturn} suffix="% p.a." />
        </Field>
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

export function StepUpSipCalculator() {
  const [monthlySip, setMonthlySip] = useState<number | ''>(10000)
  const [stepUp, setStepUp] = useState<number | ''>(10)
  const [expectedReturn, setExpectedReturn] = useState<number | ''>(12)
  const [years, setYears] = useState<number | ''>(15)

  const result = useMemo(() => {
    const m = Number(monthlySip) || 0
    const s = Number(stepUp) || 0
    const r = Number(expectedReturn) || 0
    const y = Number(years) || 0
    if (m <= 0 || y <= 0) return null
    return stepUpSipProjection(m, s, r, y)
  }, [monthlySip, stepUp, expectedReturn, years])

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
        <Field label="Expected return">
          <NumberInput value={expectedReturn} onChange={setExpectedReturn} suffix="% p.a." />
        </Field>
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
