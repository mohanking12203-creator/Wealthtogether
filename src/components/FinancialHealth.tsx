import React, { useMemo, useState } from 'react'
import { Card, Field, SectionTitle, StatTile, inputClass } from './ui'

const SAVINGS_RATE_OPTIONS = [5, 10, 15, 20, 25]

function calculateScore(values: {
  emergencyFund: boolean
  healthInsurance: boolean
  termInsurance: boolean
  sipStarted: boolean
  existingLoans: boolean
  savingsRate: number
}) {
  const parts = {
    emergencyFund: values.emergencyFund ? 20 : 0,
    healthInsurance: values.healthInsurance ? 15 : 0,
    termInsurance: values.termInsurance ? 15 : 0,
    sipStarted: values.sipStarted ? 20 : 0,
    existingLoans: values.existingLoans ? 0 : 15,
    savingsRate:
      values.savingsRate >= 20 ? 15 : values.savingsRate >= 10 ? 10 : 5,
  }

  return {
    score: parts.emergencyFund + parts.healthInsurance + parts.termInsurance + parts.sipStarted + parts.existingLoans + parts.savingsRate,
    parts,
  }
}

export function FinancialHealth() {
  const [values, setValues] = useState({
    emergencyFund: false,
    healthInsurance: false,
    termInsurance: false,
    sipStarted: false,
    existingLoans: false,
    savingsRate: 10,
  })

  const result = useMemo(() => calculateScore(values), [values])

  const strengths = useMemo(
    () => [
      values.emergencyFund && 'Emergency fund in place',
      values.healthInsurance && 'Health insurance covered',
      values.termInsurance && 'Term insurance secured',
      values.sipStarted && 'SIP investment started',
      !values.existingLoans && 'No existing loan burden',
      values.savingsRate >= 20 && 'Strong savings rate',
    ].filter(Boolean) as string[],
    [values]
  )

  const improvements = useMemo(
    () => [
      !values.emergencyFund && 'Build a 3–6 months emergency fund',
      !values.healthInsurance && 'Get health insurance coverage',
      !values.termInsurance && 'Consider term insurance for protection',
      !values.sipStarted && 'Start an SIP for disciplined investing',
      values.existingLoans && 'Manage loan repayments carefully',
      values.savingsRate < 20 && 'Increase savings rate to 20% or more',
    ].filter(Boolean) as string[],
    [values]
  )

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle
          eyebrow="Financial Health"
          title="Financial Health Score"
          description="Assess your readiness with a simple score, strengths and areas to improve for healthier financial planning."
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Emergency Fund available?">
              <div className="flex gap-3 flex-wrap">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValues({ ...values, emergencyFund: option === 'Yes' })}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      values.emergencyFund === (option === 'Yes')
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Health Insurance?">
              <div className="flex gap-3 flex-wrap">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValues({ ...values, healthInsurance: option === 'Yes' })}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      values.healthInsurance === (option === 'Yes')
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Term Insurance?">
              <div className="flex gap-3 flex-wrap">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValues({ ...values, termInsurance: option === 'Yes' })}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      values.termInsurance === (option === 'Yes')
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="SIP Started?">
              <div className="flex gap-3 flex-wrap">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValues({ ...values, sipStarted: option === 'Yes' })}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      values.sipStarted === (option === 'Yes')
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Existing Loans?">
              <div className="flex gap-3 flex-wrap">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValues({ ...values, existingLoans: option === 'Yes' })}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      values.existingLoans === (option === 'Yes')
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Savings Rate (% of income)">
              <select
                className={inputClass}
                value={values.savingsRate}
                onChange={(e) => setValues({ ...values, savingsRate: Number(e.target.value) })}
              >
                {SAVINGS_RATE_OPTIONS.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}%
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-4 rounded-3xl border border-navy-900/10 bg-navy-950/5 p-5">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Your score</p>
              <p className="mt-3 text-5xl font-display text-navy-900">{result.score}/100</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-navy-900/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400 to-navy-900 transition-all"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <StatTile label="Strengths" value={`${strengths.length} areas`} accent />
              <StatTile label="Improvement areas" value={`${improvements.length} areas`} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="bg-navy-950/5 border-navy-900/10">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Strengths</p>
            <ul className="mt-4 space-y-3 text-sm text-navy-700">
              {strengths.length > 0 ? (
                strengths.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-500" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-navy-500">No strengths selected yet. Answer more questions to see your score.</li>
              )}
            </ul>
          </Card>

          <Card className="bg-navy-950/5 border-navy-900/10">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Improvement areas</p>
            <ul className="mt-4 space-y-3 text-sm text-navy-700">
              {improvements.length > 0 ? (
                improvements.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-navy-900" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-navy-500">All essentials covered. Maintain the progress and review annually.</li>
              )}
            </ul>
          </Card>
        </div>
      </Card>
    </div>
  )
}
