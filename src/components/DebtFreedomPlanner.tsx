import React, { useEffect, useMemo, useState } from 'react'
import type { DebtReportSummary } from '../types'
import {
  calculateLoanClosure,
  recommendDebtVsSip,
  computeDebtHealthScore,
} from '../utils/debtCalculations'
import { Card, Field, NumberInput, SectionTitle, StatTile } from './ui'

function LoanPlannerSection({
  title,
  loanType,
}: {
  title: string
  loanType: string
}) {
  const [outstanding, setOutstanding] = useState<number | ''>(0)
  const [rate, setRate] = useState<number | ''>(8)
  const [years, setYears] = useState<number | ''>(10)
  const [emi, setEmi] = useState<number | ''>(0)
  const [extraEmi, setExtraEmi] = useState<number | ''>(0)

  const result = useMemo(() => {
    const out = Number(outstanding) || 0
    const r = Number(rate) || 0
    const y = Number(years) || 0
    const e = Number(emi) || 0
    const extra = Number(extraEmi) || 0
    if (out <= 0 || r <= 0 || y <= 0 || e <= 0) return null
    return calculateLoanClosure(out, r, y, e, extra)
  }, [outstanding, rate, years, emi, extraEmi])

  return (
    <Card>
      <SectionTitle
        eyebrow={title}
        title={loanType}
        description={`Compare current and accelerated closure for ${loanType.toLowerCase()}.`}
      />
      <div className="grid gap-4 lg:grid-cols-5 mb-6">
        <Field label="Outstanding loan amount">
          <NumberInput value={outstanding} onChange={setOutstanding} suffix="₹" />
        </Field>
        <Field label="Interest rate">
          <NumberInput value={rate} onChange={setRate} suffix="%" />
        </Field>
        <Field label="Remaining tenure">
          <NumberInput value={years} onChange={setYears} suffix="yrs" />
        </Field>
        <Field label="Current EMI">
          <NumberInput value={emi} onChange={setEmi} suffix="₹" />
        </Field>
        <Field label="Extra EMI (optional)">
          <NumberInput value={extraEmi} onChange={setExtraEmi} suffix="₹" />
        </Field>
      </div>
      {result ? (
        <div className="grid gap-4 md:grid-cols-4">
          <StatTile label="Current closure" value={result.currentClosureDate} />
          <StatTile label="New closure" value={result.newClosureDate} accent />
          <StatTile label="Interest saved" value={result.interestSaved ? `₹${result.interestSaved.toLocaleString('en-IN')}` : '₹0'} />
          <StatTile label="Years saved" value={`${result.yearsSaved}`} />
        </div>
      ) : (
        <p className="text-sm text-navy-700/60">Complete the loan details to see accelerated payoff impact.</p>
      )}
    </Card>
  )
}

export function DebtFreedomPlanner({
  onDebtSummaryChange,
  onBookConsultation,
}: {
  onDebtSummaryChange: (summary: DebtReportSummary) => void
  onBookConsultation: () => void
}) {
  const [surplus, setSurplus] = useState<number | ''>(5000)
  const [loanRate, setLoanRate] = useState<number | ''>(12)
  const [sipReturn, setSipReturn] = useState<number | ''>(12)
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>(50000)
  const [totalDebt, setTotalDebt] = useState<number | ''>(20000)
  const [emergencyFund, setEmergencyFund] = useState(false)
  const [healthInsurance, setHealthInsurance] = useState(false)
  const [termInsurance, setTermInsurance] = useState(false)
  const [investments, setInvestments] = useState(false)

  const comparison = useMemo(
    () => {
      const m = Number(surplus) || 0
      const l = Number(loanRate) || 0
      const s = Number(sipReturn) || 0
      if (m <= 0 || l <= 0 || s <= 0) return null
      return recommendDebtVsSip(m, l, s)
    },
    [surplus, loanRate, sipReturn]
  )

  const health = useMemo(
    () => {
      const income = Number(monthlyIncome) || 0
      const debt = Number(totalDebt) || 0
      return computeDebtHealthScore({
        monthlyIncome: income,
        totalDebt: debt,
        emergencyFund,
        healthInsurance,
        termInsurance,
        investments,
      })
    },
    [monthlyIncome, totalDebt, emergencyFund, healthInsurance, termInsurance, investments]
  )

  useEffect(() => {
    onDebtSummaryChange({
      debtHealthScore: health.score,
      debtToIncomeRatio: health.debtToIncomeRatio,
      recommendation: comparison?.recommendation || 'Update inputs to get a recommendation',
      explanation: comparison?.explanation || 'Complete debt and SIP inputs to generate a recommendation.',
      areasToImprove: health.areasToImprove,
    })
  }, [health, comparison, onDebtSummaryChange])

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle
          eyebrow="Debt Freedom"
          title="Debt Freedom Planner"
          description="Model loan payoff options, compare debt prepayment with SIP investing, and understand your debt health score."
        />
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          <div className="rounded-3xl bg-navy-950/5 border border-navy-900/10 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Debt Health Score</p>
            <p className="mt-4 text-5xl font-bold text-navy-900">{health.score}/100</p>
            <p className="mt-2 text-sm text-navy-700/80">Debt-to-income ratio: {health.debtToIncomeRatio.toFixed(1)}%</p>
          </div>
          <div className="rounded-3xl bg-white border border-navy-900/10 p-5">
            <h3 className="font-semibold text-navy-900">Debt vs SIP comparison</h3>
            {comparison ? (
              <div className="mt-4 space-y-3 text-sm text-navy-700">
                <p className="font-semibold text-navy-900">Recommendation:</p>
                <p>{comparison.recommendation}</p>
                <p>{comparison.explanation}</p>
              </div>
            ) : (
              <p className="text-sm text-navy-700/70">Fill surplus, loan rate and SIP return to get a recommendation.</p>
            )}
          </div>
          <div className="rounded-3xl bg-white border border-navy-900/10 p-5">
            <h3 className="font-semibold text-navy-900">Consultation</h3>
            <div className="mt-4 space-y-3 text-sm text-navy-700">
              <p>Review your debt plan with the WealthTogether team.</p>
              <a
                href="#book-consultation"
                className="inline-flex rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600 transition"
              >
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <LoanPlannerSection title="Home Loan Planner" loanType="Home Loan" />
        <LoanPlannerSection title="Car Loan Planner" loanType="Car Loan" />
        <LoanPlannerSection title="Personal Loan Planner" loanType="Personal Loan" />
      </div>

      <Card>
        <SectionTitle
          eyebrow="Debt vs SIP"
          title="Compare surplus repayment with investing"
          description="Understand whether to reduce debt, invest in SIPs, or split surplus across both."
        />
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          <Field label="Monthly surplus amount">
            <NumberInput value={surplus} onChange={setSurplus} suffix="₹" />
          </Field>
          <Field label="Loan interest rate">
            <NumberInput value={loanRate} onChange={setLoanRate} suffix="%" />
          </Field>
          <Field label="Expected SIP return">
            <NumberInput value={sipReturn} onChange={setSipReturn} suffix="%" />
          </Field>
        </div>
        {comparison ? (
          <div className="space-y-3 rounded-3xl border border-navy-900/10 bg-navy-950/5 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-gold-600">Recommendation</p>
            <p className="text-xl font-semibold text-navy-900">{comparison.recommendation}</p>
            <p className="text-sm text-navy-700/80">{comparison.explanation}</p>
          </div>
        ) : (
          <p className="text-sm text-navy-700/70">Enter your surplus, loan rate and SIP return to receive a comparison.</p>
        )}
      </Card>

      <Card>
        <SectionTitle
          eyebrow="Debt Health"
          title="WealthTogether Debt Health Score"
          description="Assess your debt profile with a composite score and improvement actions."
        />
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          <Field label="Monthly income">
            <NumberInput value={monthlyIncome} onChange={setMonthlyIncome} suffix="₹" />
          </Field>
          <Field label="Total debt amount">
            <NumberInput value={totalDebt} onChange={setTotalDebt} suffix="₹" />
          </Field>
          <div className="grid gap-3">
            <label className="block text-sm font-medium text-navy-800">Emergency fund available?</label>
            <div className="flex gap-2 flex-wrap">
              {['Yes', 'No'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setEmergencyFund(option === 'Yes')}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    emergencyFund === (option === 'Yes')
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          <div className="grid gap-3">
            <label className="block text-sm font-medium text-navy-800">Health insurance?</label>
            <div className="flex gap-2 flex-wrap">
              {['Yes', 'No'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setHealthInsurance(option === 'Yes')}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    healthInsurance === (option === 'Yes')
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            <label className="block text-sm font-medium text-navy-800">Term insurance?</label>
            <div className="flex gap-2 flex-wrap">
              {['Yes', 'No'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTermInsurance(option === 'Yes')}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    termInsurance === (option === 'Yes')
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            <label className="block text-sm font-medium text-navy-800">Existing investments?</label>
            <div className="flex gap-2 flex-wrap">
              {['Yes', 'No'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setInvestments(option === 'Yes')}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    investments === (option === 'Yes')
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Debt health score" value={`${health.score}/100`} accent />
          <StatTile label="DTI ratio" value={`${health.debtToIncomeRatio.toFixed(1)}%`} />
          <StatTile label="Emergency fund" value={emergencyFund ? 'Yes' : 'No'} />
          <StatTile label="Insurance" value={`${healthInsurance ? 1 : 0} / 2 covered`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-gold-100 bg-gold-50/80">
            <p className="text-sm uppercase tracking-[0.18em] text-gold-600">Areas to improve</p>
            <ul className="mt-4 space-y-2 text-sm text-navy-700">
              {health.areasToImprove.length > 0 ? (
                health.areasToImprove.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-navy-900" />
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-navy-700/70">Your debt profile looks healthy.</li>
              )}
            </ul>
          </Card>
          <Card className="border-navy-900/10 bg-white">
            <p className="text-sm uppercase tracking-[0.18em] text-gold-600">Recommended action steps</p>
            <ul className="mt-4 space-y-2 text-sm text-navy-700">
              {health.actionSteps.length > 0 ? (
                health.actionSteps.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-600" />
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-navy-700/70">Keep the current strategy and review regularly.</li>
              )}
            </ul>
          </Card>
        </div>
      </Card>

      <div className="rounded-3xl border border-navy-900/10 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-navy-900 mb-3">Ready to discuss your debt strategy?</h3>
        <p className="text-sm text-navy-700/80 mb-4">
          Book a free consultation with the WealthTogether team to review your debt freedom plan and next steps.
        </p>
        <button
          type="button"
          onClick={onBookConsultation}
          className="rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/15 hover:bg-gold-600 transition"
        >
          Book Consultation
        </button>
      </div>
    </div>
  )
}
