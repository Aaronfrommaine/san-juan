export interface CalculatorResults {
  loanAmount: number;
  cashRequired: number;
  totalAllIn: number;
  arvPercentage: number;
  noi: number;
  equityEnd: number;
  monthlyCashFlow: number;
  cashOnCash: number;
}

export interface CalculatorFormData {
  purchasePrice: number;
  closingCosts: number;
  holdingCosts: number;
  includeInLoan: 'Yes' | 'No';
  rehabBudget: number;
  rehabMonths: number;
  financingType: 'Financing' | 'Cash';
  lenderCaps: 'cost' | 'arv';
  maxPercentFinanced: number;
  originationPoints: number;
  otherLenderCosts: number;
  pointsTiming: 'Upfront' | 'Backend';
  interestRate: number;
  interestDuringRehab: 'Yes' | 'No';
  profitSplit: 'Yes' | 'No';
  arvRent: number;
  monthsToRent: number;
  projIncome: number;
  projExpenses: number;
  refinance: 'Yes' | 'No';
  mortgagePayment: number;
}