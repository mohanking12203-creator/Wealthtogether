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

export type LeadRiskProfile = 'Conservative' | 'Moderate' | 'Aggressive'
export type LeadGoal = 'Wealth Creation' | 'Retirement' | 'Child Education' | 'Tax Saving'

export interface Lead {
  id: string
  createdAt: string
  name: string
  mobile: string
  email: string
  age: string
  monthlySip: string
  riskProfile: LeadRiskProfile
  goal: LeadGoal
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
