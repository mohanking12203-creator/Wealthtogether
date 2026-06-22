import React, { useMemo, useState } from 'react'
import {
  retirementCorpus,
  sipRequiredForTarget,
  educationProjection,
  termInsuranceCover,
  HEALTH_INSURANCE_BANDS,
  aumTrailIncome,
  formatINR,
} from '../utils/calculations'
import { DEFAULT_COMMISSION } from '../data/funds'
import { Card, Field, NumberInput, SectionTitle, StatTile, inputClass } from './ui'

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState<number | ''>(30)
  const [retirementAge, setRetirementAge] = useState<number | ''>(60)
  const [expense, setExpense] = useState<number | ''>(40000)
  const [inflation, setInflation] = useState<number | ''>(6)

  const result = useMemo(() => {
    const ca = Number(currentAge) || 0
    const ra = Number(retirementAge) || 0
    const exp = Number(expense) || 0
    const inf = Number(inflation) || 0
    if (ra <= ca || exp <= 0) return null
    const corpus = retirementCorpus(ca, ra, exp, inf)
    const suggestedSip = sipRequiredForTarget(corpus.corpusRequired, corpus.yearsToRetire, 12)
    return { ...corpus, suggestedSip }
  }, [currentAge, retirementAge, expense, inflation])

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
        <div className="grid sm:grid-cols-3 gap-3">
          <StatTile label="Future monthly expense" value={formatINR(result.futureMonthlyExpense)} />
          <StatTile label="Retirement corpus required" value={formatINR(result.corpusRequired)} accent />
          <StatTile label="Suggested monthly SIP" value={formatINR(result.suggestedSip)} />
        </div>
      ) : (
        <p className="text-sm text-navy-700/60">Retirement age must be greater than current age.</p>
      )}
    </Card>
  )
}

export function ChildEducationCalculator() {
  const [childAge, setChildAge] = useState<number | ''>(5)
  const [collegeAge, setCollegeAge] = useState<number | ''>(18)
  const [currentCost, setCurrentCost] = useState<number | ''>(1500000)
  const [inflation, setInflation] = useState<number | ''>(8)

  const result = useMemo(() => {
    const ca = Number(childAge) || 0
    const cga = Number(collegeAge) || 0
    const cost = Number(currentCost) || 0
    const inf = Number(inflation) || 0
    if (cga <= ca || cost <= 0) return null
    return educationProjection(ca, cga, cost, inf)
  }, [childAge, collegeAge, currentCost, inflation])

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
        <div className="grid sm:grid-cols-3 gap-3">
          <StatTile label="Years to goal" value={`${result.yearsToGoal} yrs`} />
          <StatTile label="Future education cost" value={formatINR(result.futureCost)} accent />
          <StatTile label="Required monthly SIP" value={formatINR(result.requiredSip)} />
        </div>
      ) : (
        <p className="text-sm text-navy-700/60">College age must be greater than the child's current age.</p>
      )}
    </Card>
  )
}

export function InsuranceCalculator() {
  const [annualIncome, setAnnualIncome] = useState<number | ''>(1200000)
  const [familyType, setFamilyType] = useState<keyof typeof HEALTH_INSURANCE_BANDS>('Couple')

  const cover = termInsuranceCover(Number(annualIncome) || 0)
  const band = HEALTH_INSURANCE_BANDS[familyType]

  return (
    <Card>
      <SectionTitle
        eyebrow="Module 07"
        title="Insurance Calculator"
        description="Term cover sized at 15x annual income, plus an indicative health insurance premium band by family type."
      />
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-display text-lg text-navy-900 mb-3">Term insurance</h3>
          <Field label="Annual income">
            <NumberInput value={annualIncome} onChange={setAnnualIncome} suffix="₹" />
          </Field>
          <div className="mt-4">
            <StatTile label="Recommended cover" value={formatINR(cover)} accent />
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg text-navy-900 mb-3">Health insurance</h3>
          <Field label="Family type">
            <select
              className={inputClass}
              value={familyType}
              onChange={(e) => setFamilyType(e.target.value as keyof typeof HEALTH_INSURANCE_BANDS)}
            >
              {Object.keys(HEALTH_INSURANCE_BANDS).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>
          <div className="mt-4">
            <StatTile
              label="Indicative annual premium"
              value={`${formatINR(band[0])} – ${formatINR(band[1])}`}
            />
          </div>
        </div>
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
