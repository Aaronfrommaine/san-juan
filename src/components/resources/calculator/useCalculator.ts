import { useState } from 'react';
import { CalculatorResults } from './types';

export function useCalculator() {
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const calculateResults = (formData: any): CalculatorResults => {
    // Calculate loan amount
    const loanAmount = formData.financingType === 'Financing' 
      ? (formData.purchasePrice + formData.rehabBudget) * (formData.maxPercentFinanced / 100)
      : 0;

    // Calculate total all-in cost
    const totalAllIn = formData.purchasePrice + formData.rehabBudget + formData.closingCosts + formData.holdingCosts;

    // Calculate cash required
    const cashRequired = totalAllIn - loanAmount;

    // Calculate ARV percentage
    const arvPercentage = (totalAllIn / formData.arvRent) * 100;

    // Calculate monthly NOI
    const noi = formData.projIncome - formData.projExpenses - formData.mortgagePayment;

    // Calculate equity at end
    const equityEnd = formData.arvRent - loanAmount;

    // Calculate monthly cash flow
    const monthlyCashFlow = formData.projIncome - formData.projExpenses - formData.mortgagePayment;

    // Calculate cash-on-cash return
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCash = (annualCashFlow / cashRequired) * 100;

    const results = {
      loanAmount,
      cashRequired,
      totalAllIn,
      arvPercentage,
      noi,
      equityEnd,
      monthlyCashFlow,
      cashOnCash
    };

    setResults(results);
    return results;
  };

  return { results, calculateResults };
}