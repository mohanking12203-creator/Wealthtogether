export type RiskProfile = 'Low' | 'Moderate' | 'High'

export interface ClientProfile {
  name: string
  age: number | ''
  monthlySip: number | ''
  riskProfile: RiskProfile
  durationYears: number | ''
}

export interface FundAllocation {
  fund: string
  percent: number
}

export interface Fund {
  name: string
  category: string
  commission: number // %
  expenseRatio: number // %
  riskLevel: RiskProfile
}

export interface YearlyRow {
  year: number
  invested: number
  value: number
  profit: number
}
