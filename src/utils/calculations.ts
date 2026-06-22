import type { FundAllocation, RiskProfile, YearlyRow } from '../types'

export const RISK_RETURN_ASSUMPTIONS: Record<RiskProfile, number> = {
  Low: 10,
  Moderate: 12,
  High: 15,
}

export function getRiskReturnAssumption(riskProfile: RiskProfile): number {
  return RISK_RETURN_ASSUMPTIONS[riskProfile]
}

/** Future value of a monthly SIP, compounded monthly, with yearly breakdown. */
export function sipProjection(
  monthlySip: number,
  annualReturnPct: number,
  years: number
): { rows: YearlyRow[]; totalInvested: number; corpus: number; wealthCreated: number } {
  const r = annualReturnPct / 100 / 12
  const rows: YearlyRow[] = []
  let balance = 0
  let invested = 0

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + monthlySip
      invested += monthlySip
    }
    rows.push({
      year,
      invested: Math.round(invested),
      value: Math.round(balance),
      profit: Math.round(balance - invested),
    })
  }

  return {
    rows,
    totalInvested: Math.round(invested),
    corpus: Math.round(balance),
    wealthCreated: Math.round(balance - invested),
  }
}

/** Approximate XIRR for a level monthly SIP: effective annualised return on the cashflows. */
export function xirrApprox(monthlySip: number, years: number, corpus: number): number {
  // Solve r such that FV of monthly annuity at rate r/12 over n months = corpus
  const n = years * 12
  if (monthlySip <= 0 || n <= 0) return 0
  let lo = -0.5
  let hi = 1.5
  const fv = (rateAnnual: number) => {
    const r = rateAnnual / 12
    if (Math.abs(r) < 1e-9) return monthlySip * n
    let bal = 0
    for (let i = 0; i < n; i++) bal = bal * (1 + r) + monthlySip
    return bal
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (fv(mid) > corpus) hi = mid
    else lo = mid
  }
  return Math.round(((lo + hi) / 2) * 10000) / 100
}

/** Step-up SIP: monthly contribution increases by stepUpPct every 12 months. */
export function stepUpSipProjection(
  startMonthlySip: number,
  stepUpPct: number,
  annualReturnPct: number,
  years: number
): { rows: YearlyRow[]; totalInvested: number; corpus: number; wealthCreated: number } {
  const r = annualReturnPct / 100 / 12
  const rows: YearlyRow[] = []
  let balance = 0
  let invested = 0
  let currentSip = startMonthlySip

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + currentSip
      invested += currentSip
    }
    rows.push({
      year,
      invested: Math.round(invested),
      value: Math.round(balance),
      profit: Math.round(balance - invested),
    })
    currentSip = currentSip * (1 + stepUpPct / 100)
  }

  return {
    rows,
    totalInvested: Math.round(invested),
    corpus: Math.round(balance),
    wealthCreated: Math.round(balance - invested),
  }
}

/** Retirement corpus required using real-return withdrawal (25x annual expense rule, inflation-adjusted). */
export function retirementCorpus(
  currentAge: number,
  retirementAge: number,
  currentMonthlyExpense: number,
  inflationPct: number,
  postRetirementReturnPct = 7,
  yearsInRetirement = 25
): { futureMonthlyExpense: number; corpusRequired: number; yearsToRetire: number } {
  const yearsToRetire = Math.max(retirementAge - currentAge, 0)
  const futureMonthlyExpense =
    currentMonthlyExpense * Math.pow(1 + inflationPct / 100, yearsToRetire)
  const annualExpense = futureMonthlyExpense * 12
  // real rate during retirement (return vs inflation continuing)
  const realRate = (1 + postRetirementReturnPct / 100) / (1 + inflationPct / 100) - 1
  let corpusRequired: number
  if (Math.abs(realRate) < 1e-6) {
    corpusRequired = annualExpense * yearsInRetirement
  } else {
    corpusRequired =
      (annualExpense * (1 - Math.pow(1 + realRate, -yearsInRetirement))) / realRate
  }
  return {
    futureMonthlyExpense: Math.round(futureMonthlyExpense),
    corpusRequired: Math.round(corpusRequired),
    yearsToRetire,
  }
}

/** Required monthly SIP to reach a target corpus in N years at a given return. */
export function sipRequiredForTarget(
  targetCorpus: number,
  years: number,
  annualReturnPct: number
): number {
  const r = annualReturnPct / 100 / 12
  const n = years * 12
  if (n <= 0) return targetCorpus
  if (Math.abs(r) < 1e-9) return Math.round(targetCorpus / n)
  const factor = (Math.pow(1 + r, n) - 1) / r
  return Math.round(targetCorpus / factor)
}

export function educationProjection(
  currentAge: number,
  collegeAge: number,
  currentCost: number,
  inflationPct: number,
  expectedReturnPct = 12
) {
  const yearsToGoal = Math.max(collegeAge - currentAge, 0)
  const futureCost = currentCost * Math.pow(1 + inflationPct / 100, yearsToGoal)
  const requiredSip = sipRequiredForTarget(futureCost, yearsToGoal || 1, expectedReturnPct)
  return { yearsToGoal, futureCost: Math.round(futureCost), requiredSip }
}

export function termInsuranceCover(annualIncome: number) {
  return Math.round(annualIncome * 15)
}

export const HEALTH_INSURANCE_BANDS: Record<string, [number, number]> = {
  Single: [8000, 15000],
  Couple: [15000, 25000],
  'Family Floater': [25000, 50000],
}

export function validateFundAllocation(
  allocations: FundAllocation[],
  monthlySip: number
): { validatedAllocations: Array<FundAllocation & { monthlyAmount: number }>; warning: string | null } {
  if (monthlySip <= 0) {
    return {
      validatedAllocations: allocations.map((allocation) => ({
        ...allocation,
        monthlyAmount: 0,
      })),
      warning: null,
    }
  }

  const rows = allocations.map((allocation) => ({
    ...allocation,
    monthlyAmount: 0,
  }))

  const flexiIndex = rows.findIndex((row) => row.fund.toLowerCase().includes('flexi cap'))
  const midIndex = rows.findIndex((row) => row.fund.toLowerCase().includes('mid cap'))
  const dividendIndex = rows.findIndex((row) => row.fund.toLowerCase().includes('dividend yield'))
  const smallIndex = rows.findIndex((row) => row.fund.toLowerCase().includes('small cap'))
  const contraIndex = rows.findIndex((row) => row.fund.toLowerCase().includes('contra'))

  const fixedContra = 500
  let warning: string | null = null

  const tierWeights =
    monthlySip >= 10000
      ? {
          flexi: 0.35,
          mid: 0.25,
          contra: 0.05,
          dividend: 0.15,
          small: 0.2,
        }
      : monthlySip >= 8000
        ? {
            flexi: 0.4375,
            mid: 0.25,
            contra: 0.0625,
            dividend: 0.25,
          }
        : monthlySip >= 6000
          ? {
              flexi: 0.5,
              mid: 0.4167,
              contra: 0.0833,
            }
          : monthlySip >= 4000
            ? {
                flexi: 0.5,
                mid: 0.375,
                contra: 0.125,
              }
            : null

  if (tierWeights) {
    if (contraIndex >= 0) {
      rows[contraIndex].monthlyAmount = fixedContra
      warning = null
    }

    const totalToDistribute = Math.max(monthlySip - fixedContra, 0)
    const candidateAmounts: Array<{ index: number; amount: number }> = []
    const dividendWeight = tierWeights.dividend ?? 0
    const smallWeight = tierWeights.small ?? 0

    if (flexiIndex >= 0) {
      candidateAmounts.push({
        index: flexiIndex,
        amount: Math.round(totalToDistribute * tierWeights.flexi),
      })
    }
    if (midIndex >= 0) {
      candidateAmounts.push({
        index: midIndex,
        amount: Math.round(totalToDistribute * tierWeights.mid),
      })
    }
    if (dividendIndex >= 0 && dividendWeight > 0) {
      candidateAmounts.push({
        index: dividendIndex,
        amount: Math.round(totalToDistribute * dividendWeight),
      })
    }
    if (smallIndex >= 0 && smallWeight > 0) {
      candidateAmounts.push({
        index: smallIndex,
        amount: Math.round(totalToDistribute * smallWeight),
      })
    }

    const allocatedAmount = candidateAmounts.reduce((sum, item) => sum + item.amount, 0)
    const residual = monthlySip - fixedContra - allocatedAmount

    if (flexiIndex >= 0 && residual !== 0) {
      rows[flexiIndex].monthlyAmount += residual
    }

    candidateAmounts.forEach((item) => {
      rows[item.index].monthlyAmount += item.amount
    })

    const validatedAllocations = rows.map((row) => ({
      ...row,
      percent: monthlySip > 0 ? Math.round((row.monthlyAmount / monthlySip) * 100) : 0,
    }))

    return {
      validatedAllocations,
      warning,
    }
  }

  const baseRows = allocations.map((allocation) => ({
    ...allocation,
    monthlyAmount: Math.round((monthlySip * allocation.percent) / 100),
  }))

  return {
    validatedAllocations: baseRows.map((row) => ({
      ...row,
      percent: monthlySip > 0 ? Math.round((row.monthlyAmount / monthlySip) * 100) : 0,
    })),
    warning: null,
  }
}

export function aumTrailIncome(currentAum: number, commissionPct: number) {
  const annual = (currentAum * commissionPct) / 100
  return { annual: Math.round(annual), monthly: Math.round(annual / 12) }
}

export function formatINR(value: number): string {
  if (!isFinite(value)) return '₹0'
  return '₹' + Math.round(value).toLocaleString('en-IN')
}
