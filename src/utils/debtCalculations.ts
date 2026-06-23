export interface LoanClosureResult {
  currentClosureDate: string
  newClosureDate: string
  interestSaved: number
  yearsSaved: number
  currentInterest: number
  newInterest: number
  remainingYears: number
  newRemainingYears: number
  outstanding: number
  ratePct: number
  emi: number
  extraEmi: number
}

export interface DebtComparisonResult {
  monthlySurplus: number
  loanInterestRate: number
  sipReturn: number
  recommendation: 'Prepay Loan' | 'Invest in SIP' | 'Split Between Both'
  explanation: string
}

export interface DebtHealthResult {
  debtToIncomeRatio: number
  score: number
  areasToImprove: string[]
  actionSteps: string[]
}

export function offsetDateByMonths(start: Date, months: number): Date {
  const date = new Date(start)
  const targetMonth = date.getMonth() + months
  date.setMonth(targetMonth)
  return date
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  })
}

function simulateLoanBalance(
  outstanding: number,
  annualRatePct: number,
  monthlyPayment: number,
  maxMonths = 600
) {
  const monthlyRate = annualRatePct / 100 / 12
  let balance = outstanding
  let totalInterest = 0
  let months = 0
  while (balance > 0 && months < maxMonths) {
    const interest = balance * monthlyRate
    const principalPayment = Math.max(monthlyPayment - interest, 0)
    if (principalPayment <= 0) {
      break
    }
    balance = Math.max(balance + interest - monthlyPayment, 0)
    totalInterest += interest
    months += 1
  }
  return {
    months,
    totalInterest: Math.round(totalInterest),
  }
}

export function calculateLoanClosure(
  outstanding: number,
  annualRatePct: number,
  remainingTenureYears: number,
  emi: number,
  extraEmi: number
): LoanClosureResult {
  const currentMonths = Math.round(Math.max(remainingTenureYears, 0) * 12)
  const currentClosure = offsetDateByMonths(new Date(), currentMonths)
  const currentInterest = Math.max(Math.round(emi * currentMonths - outstanding), 0)

  const newPayment = Math.max(emi + extraEmi, emi)
  const newResult = simulateLoanBalance(outstanding, annualRatePct, newPayment)
  const newClosure = offsetDateByMonths(new Date(), newResult.months)
  const interestSaved = Math.max(currentInterest - newResult.totalInterest, 0)
  const yearsSaved = Math.max((currentMonths - newResult.months) / 12, 0)

  return {
    currentClosureDate: formatDate(currentClosure),
    newClosureDate: formatDate(newClosure),
    interestSaved,
    yearsSaved: Math.round(yearsSaved * 100) / 100,
    currentInterest,
    newInterest: newResult.totalInterest,
    remainingYears: remainingTenureYears,
    newRemainingYears: Math.round(newResult.months / 12 * 100) / 100,
    outstanding,
    ratePct: annualRatePct,
    emi,
    extraEmi,
  }
}

export function recommendDebtVsSip(
  monthlySurplus: number,
  loanInterestRate: number,
  expectedSipReturn: number
): DebtComparisonResult {
  const gap = expectedSipReturn - loanInterestRate
  let recommendation: DebtComparisonResult['recommendation']
  let explanation = ''

  if (gap >= 2) {
    recommendation = 'Invest in SIP'
    explanation = `Your expected SIP return of ${expectedSipReturn}% is higher than your loan interest rate of ${loanInterestRate}%. Investing surplus can create more wealth than the cost of debt.`
  } else if (gap <= -2) {
    recommendation = 'Prepay Loan'
    explanation = `Your loan interest rate of ${loanInterestRate}% is higher than expected SIP returns. Prepaying debt first is likely to save more interest than the incremental investment gain.`
  } else {
    recommendation = 'Split Between Both'
    explanation = `The loan interest rate and SIP return are close, so a balanced approach is safest. Use part of your surplus to reduce debt and part to grow wealth.`
  }

  return {
    monthlySurplus,
    loanInterestRate,
    sipReturn: expectedSipReturn,
    recommendation,
    explanation,
  }
}

export function computeDebtHealthScore(options: {
  monthlyIncome: number
  totalDebt: number
  emergencyFund: boolean
  healthInsurance: boolean
  termInsurance: boolean
  investments: boolean
}): DebtHealthResult {
  const ratio = options.monthlyIncome > 0 ? (options.totalDebt / options.monthlyIncome) * 100 : 0
  const dtiScore = ratio < 20 ? 25 : ratio < 35 ? 15 : 5
  const emergencyScore = options.emergencyFund ? 25 : 0
  const insuranceScore = (options.healthInsurance ? 10 : 0) + (options.termInsurance ? 10 : 0)
  const investmentScore = options.investments ? 20 : 0

  const score = Math.min(100, dtiScore + emergencyScore + insuranceScore + investmentScore)

  const areasToImprove: string[] = []
  const actionSteps: string[] = []

  if (ratio >= 35) {
    areasToImprove.push('High debt-to-income ratio')
    actionSteps.push('Reduce debt or increase income to bring DTI below 35%.')
  }
  if (!options.emergencyFund) {
    areasToImprove.push('Emergency fund missing')
    actionSteps.push('Build 3–6 months of essential expenses in a liquid fund.')
  }
  if (!options.healthInsurance) {
    areasToImprove.push('Health insurance unavailable')
    actionSteps.push('Secure health cover to protect against medical emergencies.')
  }
  if (!options.termInsurance) {
    areasToImprove.push('Term insurance unavailable')
    actionSteps.push('Consider term life cover to protect dependents from debt risk.')
  }
  if (!options.investments) {
    areasToImprove.push('No existing investments')
    actionSteps.push('Start a SIP or mutual fund investment to build long-term wealth.')
  }

  return {
    debtToIncomeRatio: Math.round(ratio * 100) / 100,
    score,
    areasToImprove,
    actionSteps,
  }
}
