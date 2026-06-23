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
        title: 'Age 45+',
        termPlan: 'Custom Review Required',
        healthPlan: 'Custom Review Required',
      }
    }
    if (ageValue >= 30) {
      return {
        title: 'Age 30-45',
        termPlan: 'Wealth Protection Plan',
        healthPlan: 'Family Protection Plan',
      }
    }
    return {
      title: 'Age 20-30',
      termPlan: 'Growth Protection Plan',
      healthPlan: 'Essential Health Plan',
    }
  }, [ageValue])

  const termPlans = [
    {
      name: 'Essential Protection Plan',
      recommendedFor: 'Young professionals',
      product: 'HDFC Life Click 2 Protect Supreme',
      coverage: '₹50 Lakh',
      premium: '₹500/month',
      benefits: [
        'Basic family protection',
        'Affordable premium',
        'Suitable for beginners',
      ],
      isRecommended: recommendation.termPlan === 'Essential Protection Plan',
    },
    {
      name: 'Growth Protection Plan',
      recommendedFor: 'Salaried individuals',
      product: 'Axis Max Life Smart Term Plan',
      coverage: '₹1 Crore',
      premium: '₹900/month',
      benefits: [
        'Higher coverage',
        'Income replacement',
        'Long-term security',
      ],
      isRecommended: recommendation.termPlan === 'Growth Protection Plan',
    },
    {
      name: 'Wealth Protection Plan',
      recommendedFor: 'High earners',
      product: 'Tata AIA Sampoorna Raksha Promise',
      coverage: '₹2 Crore',
      premium: '₹1,800/month',
      benefits: [
        'Maximum protection',
        'Family wealth security',
        'Suitable for long-term planning',
      ],
      isRecommended: recommendation.termPlan === 'Wealth Protection Plan',
    },
  ]

  const healthPlans = [
    {
      name: 'Essential Health Plan',
      product: 'HDFC ERGO Optima Secure',
      coverage: '₹10 Lakh',
      individual: '₹800/month',
      family: '₹1,200/month',
      benefits: [
        'Hospitalization coverage',
        'Medical emergency protection',
        'Cashless treatment',
      ],
      isRecommended: recommendation.healthPlan === 'Essential Health Plan',
    },
    {
      name: 'Family Protection Plan',
      product: 'Niva Bupa ReAssure 2.0',
      coverage: '₹20 Lakh',
      individual: '₹1,200/month',
      family: '₹1,800/month',
      benefits: [
        'Family-focused coverage',
        'Higher hospitalization limit',
        'Comprehensive protection',
      ],
      isRecommended: recommendation.healthPlan === 'Family Protection Plan',
    },
    {
      name: 'Premium Health Plan',
      product: 'ICICI Lombard Elevate',
      coverage: '₹50 Lakh',
      individual: '₹2,000/month',
      family: '₹3,000/month',
      benefits: [
        'Premium medical cover',
        'Higher claim flexibility',
        'Strong protection for larger families',
      ],
      isRecommended: recommendation.healthPlan === 'Premium Health Plan',
    },
  ]

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 07"
        title="Insurance Solutions"
        description="Compare insurance plans side by side and get tailored recommendations based on your age profile."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-navy-900/10 bg-gradient-to-br from-white to-slate-50 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Term Insurance</p>
                <h3 className="font-display text-2xl text-navy-900">Coverage Options</h3>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {termPlans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative rounded-2xl border p-5 transition-all ${
                    plan.isRecommended
                      ? 'border-gold-400 bg-gradient-to-br from-gold-50 to-white shadow-md'
                      : 'border-slate-200 bg-white hover:border-navy-900/20'
                  }`}
                >
                  {plan.isRecommended && (
                    <span className="absolute right-4 top-4 rounded-full bg-navy-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                      Most Recommended
                    </span>
                  )}
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-600">{plan.recommendedFor}</p>
                  <h4 className="mt-2 font-display text-xl text-navy-900">{plan.name}</h4>
                  <p className="mt-1 text-sm text-navy-700/70">{plan.product}</p>
                  <div className="mt-4 rounded-2xl bg-navy-900 p-3 text-white">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gold-300">Coverage</p>
                    <p className="mt-1 text-2xl font-semibold">{plan.coverage}</p>
                    <p className="mt-1 text-sm text-gold-100">{plan.premium}</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-navy-700/75">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit}>• {benefit}</li>
                    ))}
                  </ul>
                  <button className="mt-5 w-full rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-gold-400">
                    Request Consultation
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-navy-900/10 bg-gradient-to-br from-navy-950 to-navy-900 p-5 text-white">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold-300">Health Insurance</p>
                <h3 className="font-display text-2xl">Coverage Options</h3>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {healthPlans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative rounded-2xl border p-5 transition-all ${
                    plan.isRecommended
                      ? 'border-gold-400 bg-gradient-to-br from-gold-500/10 to-white/5'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {plan.isRecommended && (
                    <span className="absolute right-4 top-4 rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-900">
                      Most Recommended
                    </span>
                  )}
                  <h4 className="mt-2 font-display text-xl">{plan.name}</h4>
                  <p className="mt-1 text-sm text-white/70">{plan.product}</p>
                  <div className="mt-4 rounded-2xl bg-white/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">Coverage</p>
                    <p className="mt-1 text-2xl font-semibold text-gold-300">{plan.coverage}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      <p><span className="text-white/70">Individual:</span> {plan.individual}</p>
                      <p><span className="text-white/70">Family:</span> {plan.family}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-white/80">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit}>• {benefit}</li>
                    ))}
                  </ul>
                  <button className="mt-5 w-full rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-gold-400">
                    Request Consultation
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-2xl border border-navy-900/10 bg-gradient-to-br from-gold-50 to-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gold-700">WealthTogether Recommendation Engine</p>
          <h3 className="font-display text-2xl text-navy-900 mt-1">Tailored Advice</h3>

          <div className="mt-4">
            <Field label="Age">
              <NumberInput value={age} onChange={setAge} suffix="yrs" />
            </Field>
          </div>

          <div className="mt-4 rounded-2xl bg-navy-900 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-300">Recommended for {recommendation.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              <li>✓ {recommendation.termPlan}</li>
              <li>✓ {recommendation.healthPlan}</li>
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-navy-900/10 bg-white p-4 text-sm text-navy-700/75">
            <p className="font-medium text-navy-900">Disclaimer</p>
            <p className="mt-1">
              Premiums are indicative only and may vary based on age, health, occupation, and insurer underwriting.
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
