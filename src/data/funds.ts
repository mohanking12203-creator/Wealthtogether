import type { Fund, FundAllocation, RiskProfile } from '../types'

export const PORTFOLIOS: Record<RiskProfile, FundAllocation[]> = {
  Low: [
    { fund: 'Parag Parikh Flexi Cap', percent: 70 },
    { fund: 'ICICI Dividend Yield', percent: 30 },
  ],
  Moderate: [
    { fund: 'HDFC Flexi Cap', percent: 40 },
    { fund: 'ICICI Large & Mid Cap', percent: 30 },
    { fund: 'SBI Contra', percent: 30 },
  ],
  High: [
    { fund: 'HDFC Flexi Cap', percent: 35 },
    { fund: 'HDFC Mid Cap', percent: 30 },
    { fund: 'Bandhan Small Cap', percent: 20 },
    { fund: 'SBI Contra', percent: 15 },
  ],
}

export const DEFAULT_COMMISSION = 0.83

export const FUND_SHELF: Record<string, string[]> = {
  'Flexi Cap': ['Parag Parikh Flexi Cap', 'HDFC Flexi Cap', 'Edelweiss Flexi Cap'],
  'Large Cap': ['SBI Bluechip', 'HDFC Large Cap', 'Bandhan Large Cap'],
  'Large & Mid Cap': [
    'ICICI Large & Mid Cap',
    'Bandhan Large & Mid Cap',
    'Invesco Large & Mid Cap',
  ],
  'Multi Cap': ['ICICI Multi Cap', 'Nippon India Multi Cap', 'Mahindra Manulife Multi Cap'],
  'Mid Cap': ['HDFC Mid Cap', 'Nippon India Growth Mid Cap', 'Invesco India Mid Cap'],
  'Small Cap': ['Bandhan Small Cap', 'Nippon India Small Cap', 'Invesco India Small Cap'],
  Contra: ['SBI Contra', 'Invesco Contra'],
  'Dividend Yield': ['ICICI Dividend Yield', 'UTI Dividend Yield', 'Aditya Birla Dividend Yield'],
  Value: ['HSBC Value', 'Nippon India Value', 'HDFC Value'],
  ELSS: ['SBI ELSS', 'Motilal Oswal ELSS', 'HDFC ELSS'],
  Focused: ['HDFC Focused', 'SBI Focused', 'ICICI Focused'],
}

function seedFunds(): Fund[] {
  const riskByCategory: Record<string, RiskProfile> = {
    'Flexi Cap': 'Moderate',
    'Large Cap': 'Low',
    'Large & Mid Cap': 'Moderate',
    'Multi Cap': 'Moderate',
    'Mid Cap': 'High',
    'Small Cap': 'High',
    Contra: 'Moderate',
    'Dividend Yield': 'Low',
    Value: 'Low',
    ELSS: 'Moderate',
    Focused: 'High',
  }
  const funds: Fund[] = []
  Object.entries(FUND_SHELF).forEach(([category, names]) => {
    names.forEach((name) => {
      funds.push({
        name,
        category,
        commission: DEFAULT_COMMISSION,
        expenseRatio: 1.0,
        riskLevel: riskByCategory[category] ?? 'Moderate',
      })
    })
  })
  return funds
}

export const INITIAL_FUNDS: Fund[] = seedFunds()
