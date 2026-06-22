import React, { useMemo, useState } from 'react'
import {
  retirementCorpus,
  sipRequiredForTarget,
  educationProjection,
  aumTrailIncome,
  formatINR,
  getRiskReturnAssumption,
} from '../utils/calculations'
import type { ClientProfile } from '../types'
import { DEFAULT_COMMISSION } from '../data/funds'
import { Card, Field, NumberInput, SectionTitle, StatTile } from './ui'

export function RetirementCalculator({ profile }: { profile: ClientProfile }) {
  const [currentAge, setCurrentAge] = useState<number | ''>(30)
  const [retirementAge, setRetirementAge] = useState<number | ''>(60)
  const [expense, setExpense] = useState<number | ''>(40000)
  const [inflation, setInflation] = useState<number | ''>(6)

  const riskReturn = getRiskReturnAssumption(profile.riskProfile)

  const result = useMemo(() => {
    const ca = Number(currentAge) || 0
    const ra = Number(retirementAge) || 0
    const exp = Number(expense) || 0
    const inf = Number(inflation) || 0
    if (ra <= ca || exp <= 0) return null
    const corpus = retirementCorpus(ca, ra, exp, inf)
    const suggestedSip = sipRequiredForTarget(
      corpus.corpusRequired,
      corpus.yearsToRetire,
      riskReturn
    )
    return { ...corpus, suggestedSip, riskReturn }
  }, [currentAge, retirementAge, expense, inflation, riskReturn])

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 05"
        title="Retirement Calculator"
        description="Inflate today's monthly expense to the retirement date, then size the corpus needed to fund 25 post-retirement years."
      />
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Field label="Current age">
          <NumberInput value={currentAge} onChange={setCurrentAge} suffix="yrs" />
        </Field>
        <Field label="Retirement age">
          <NumberInput value={retirementAge} onChange={setRetirementAge} suffix="yrs" />
        </Field>
        <Field label="Current monthly expense">
          <NumberInput value={expense} onChange={setExpense} suffix="₹" />
        </Field>
        <Field label="Inflation">
          <NumberInput value={inflation} onChange={setInflation} suffix="%" />
        </Field>
      </div>
      {result ? (
        <div className="grid sm:grid-cols-4 gap-3">
          <StatTile label="Future monthly expense" value={formatINR(result.futureMonthlyExpense)} />
          <StatTile label="Retirement corpus required" value={formatINR(result.corpusRequired)} accent />
          <StatTile label="Suggested monthly SIP" value={formatINR(result.suggestedSip)} />
          <StatTile label="Expected return" value={`${result.riskReturn}% p.a.`} />
        </div>
      ) : (
        <p className="text-sm text-navy-700/60">Retirement age must be greater than current age.</p>
      )}
    </Card>
  )
}

export function ChildEducationCalculator({ profile }: { profile: ClientProfile }) {
  const [childAge, setChildAge] = useState<number | ''>(5)
  const [collegeAge, setCollegeAge] = useState<number | ''>(18)
  const [currentCost, setCurrentCost] = useState<number | ''>(1500000)
  const [inflation, setInflation] = useState<number | ''>(8)

  const riskReturn = getRiskReturnAssumption(profile.riskProfile)

  const result = useMemo(() => {
    const ca = Number(childAge) || 0
    const cga = Number(collegeAge) || 0
    const cost = Number(currentCost) || 0
    const inf = Number(inflation) || 0
    if (cga <= ca || cost <= 0) return null
    return {
      ...educationProjection(ca, cga, cost, inf, riskReturn),
      riskReturn,
    }
  }, [childAge, collegeAge, currentCost, inflation, riskReturn])

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 06"
        title="Child Education Calculator"
        description="Project today's education cost forward to college age, and back into a required monthly SIP."
      />
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Field label="Child's current age">
          <NumberInput value={childAge} onChange={setChildAge} suffix="yrs" />
        </Field>
        <Field label="College age">
          <NumberInput value={collegeAge} onChange={setCollegeAge} suffix="yrs" />
        </Field>
        <Field label="Current education cost">
          <NumberInput value={currentCost} onChange={setCurrentCost} suffix="₹" />
        </Field>
        <Field label="Inflation">
          <NumberInput value={inflation} onChange={setInflation} suffix="%" />
        </Field>
      </div>
      {result ? (
        <div className="grid sm:grid-cols-4 gap-3">
          <StatTile label="Years to goal" value={`${result.yearsToGoal} yrs`} />
          <StatTile label="Future education cost" value={formatINR(result.futureCost)} accent />
          <StatTile label="Required monthly SIP" value={formatINR(result.requiredSip)} />
          <StatTile label="Expected return" value={`${result.riskReturn}% p.a.`} />
        </div>
      ) : (
        <p className="text-sm text-navy-700/60">College age must be greater than the child's current age.</p>
      )}
    </Card>
  )
}

export function InsuranceCalculator() {
  const [age, setAge] = useState<number | ''>(35)
  const [annualIncome, setAnnualIncome] = useState<number | ''>(1200000)
  const [existingInsurance, setExistingInsurance] = useState<number | ''>(500000)
  const [liabilities, setLiabilities] = useState<number | ''>(2000000)
  const [healthOption, setHealthOption] = useState<'Single' | 'Married Couple' | 'Family Floater'>(
    'Single'
  )

  const recommendedCover = useMemo(() => {
    const income = Number(annualIncome) || 0
    const existing = Number(existingInsurance) || 0
    const liabilitiesValue = Number(liabilities) || 0
    return Math.max(0, income * 20 + liabilitiesValue - existing)
  }, [annualIncome, existingInsurance, liabilities])

  const healthRecommendations: Record<string, string> = {
    Single: '₹10 lakh',
    'Married Couple': '₹15 lakh',
    'Family Floater': '₹25 lakh'
  }

  const healthRecommendation = healthRecommendations[healthOption]

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 07"
        title="Insurance Calculator"
        description="Estimate term cover using income, liabilities, and current protection, plus a simple health insurance recommendation."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Term insurance</p>
              <h3 className="font-display text-xl text-navy-900">Recommended cover</h3>
            </div>
            <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700">
              20 × income + liabilities - existing cover
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Age">
              <NumberInput value={age} onChange={setAge} suffix="yrs" />
            </Field>
            <Field label="Annual income">
              <NumberInput value={annualIncome} onChange={setAnnualIncome} suffix="₹" />
            </Field>
            <Field label="Existing insurance">
              <NumberInput value={existingInsurance} onChange={setExistingInsurance} suffix="₹" />
            </Field>
            <Field label="Liabilities">
              <NumberInput value={liabilities} onChange={setLiabilities} suffix="₹" />
            </Field>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatTile label="Recommended cover" value={formatINR(recommendedCover)} accent />
            <StatTile label="Age input" value={age ? `${age} yrs` : '—'} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-navy-950 to-navy-900 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-gold-300">Health insurance</p>
          <h3 className="font-display text-xl mt-1">Suggested coverage</h3>
          <div className="mt-4 grid gap-3">
            {(['Single', 'Married Couple', 'Family Floater'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setHealthOption(option)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  healthOption === option
                    ? 'border-gold-400 bg-gold-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{option}</p>
                    <p className="text-xs text-white/65">Recommended coverage</p>
                  </div>
                  <span className="text-sm font-semibold text-gold-300">{healthRecommendations[option]}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">Selected option</p>
            <p className="mt-1 text-2xl font-semibold text-gold-300">{healthRecommendation}</p>
          </div>
        </section>
      </div>
    </Card>
  )
}

export function AumTracker() {
  const [aum, setAum] = useState<number | ''>(5000000)
  const [commission, setCommission] = useState<number | ''>(DEFAULT_COMMISSION)

  const result = aumTrailIncome(Number(aum) || 0, Number(commission) || 0)

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 08"
        title="AUM Tracker"
        description="Estimate trail income on the assets currently under management."
      />
      <div className="grid sm:grid-cols-2 gap-4 mb-6 max-w-xl">
        <Field label="Current AUM">
          <NumberInput value={aum} onChange={setAum} suffix="₹" />
        </Field>
        <Field label="Average commission">
          <NumberInput value={commission} onChange={setCommission} suffix="%" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
        <StatTile label="Annual trail income" value={formatINR(result.annual)} accent />
        <StatTile label="Monthly trail income" value={formatINR(result.monthly)} />
      </div>
      <p className="text-xs text-navy-700/50 mt-4">Default commission benchmark: {DEFAULT_COMMISSION}%</p>
    </Card>
  )
}
