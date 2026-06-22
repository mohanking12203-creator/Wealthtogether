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

  const ageValue = Number(age) || 0

  const recommendation = useMemo(() => {
    if (ageValue >= 45) {
      return {
        title: 'Custom Insurance Review',
        term: 'Custom review needed',
        health: 'Custom review needed',
      }
    }
    if (ageValue >= 30) {
      return {
        title: 'Recommended for ages 30–45',
        term: '₹2 Crore Term Insurance',
        health: '₹20 Lakh Health Insurance',
      }
    }
    return {
      title: 'Recommended for ages 20–30',
      term: '₹1 Crore Term Insurance',
      health: '₹10 Lakh Health Insurance',
    }
  }, [ageValue])

  const termPlans = [
    {
      cover: '₹50 Lakh Cover',
      premium: 'Approx ₹500/month',
      note: 'Ideal for starter protection',
    },
    {
      cover: '₹1 Crore Cover',
      premium: 'Approx ₹900/month',
      note: 'Balanced family protection',
    },
    {
      cover: '₹2 Crore Cover',
      premium: 'Approx ₹1,800/month',
      note: 'Higher protection for growing responsibilities',
    },
  ]

  const healthPlans = [
    {
      label: 'Individual Plan',
      coverage: '₹10 Lakh',
      premium: '₹800/month',
    },
    {
      label: 'Family Floater',
      coverage: '₹20 Lakh',
      premium: '₹1,800/month',
    },
  ]

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 07"
        title="Insurance Solutions"
        description="Recommended insurance products, premium estimates, and guidance tailored to your age profile."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-navy-900/10 bg-gradient-to-br from-white to-slate-50 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Section 1</p>
                <h3 className="font-display text-2xl text-navy-900">Term Insurance</h3>
              </div>
              <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700">
                HDFC Life Click 2 Protect Supreme
              </span>
            </div>
            <p className="text-sm text-navy-700/70 mb-4">
              Suitable for individuals aged 22–45
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {termPlans.map((plan) => (
                <div key={plan.cover} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-navy-900">{plan.cover}</p>
                  <p className="mt-2 text-lg font-semibold text-gold-700">{plan.premium}</p>
                  <p className="mt-1 text-xs text-navy-700/60">{plan.note}</p>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-navy-700/75">
              <li>• Family income protection</li>
              <li>• Low premium</li>
              <li>• High coverage</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-navy-900/10 bg-gradient-to-br from-navy-950 to-navy-900 p-5 text-white">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold-300">Section 2</p>
                <h3 className="font-display text-2xl">Health Insurance</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gold-200">
                HDFC ERGO Optima Secure
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {healthPlans.map((plan) => (
                <div key={plan.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/70">{plan.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-gold-300">{plan.coverage}</p>
                  <p className="mt-2 text-sm font-medium">Estimated Premium: {plan.premium}</p>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>• Hospitalization coverage</li>
              <li>• Medical emergency protection</li>
              <li>• Cashless treatment</li>
            </ul>
          </section>
        </div>

        <aside className="rounded-2xl border border-navy-900/10 bg-gradient-to-br from-gold-50 to-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gold-700">Section 3</p>
          <h3 className="font-display text-2xl text-navy-900 mt-1">WealthTogether Recommendation</h3>

          <div className="mt-4">
            <Field label="Age">
              <NumberInput value={age} onChange={setAge} suffix="yrs" />
            </Field>
          </div>

          <div className="mt-4 rounded-2xl bg-navy-900 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-300">Age-based suggestion</p>
            <p className="mt-2 text-sm font-semibold">{recommendation.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              <li>✓ {recommendation.term}</li>
              <li>✓ {recommendation.health}</li>
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-navy-900/10 bg-white p-4 text-sm text-navy-700/75">
            <p className="font-medium text-navy-900">Disclaimer</p>
            <p className="mt-1">
              Premiums are indicative only and may vary based on age, health condition, occupation, and insurer underwriting.
            </p>
          </div>
        </aside>
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
