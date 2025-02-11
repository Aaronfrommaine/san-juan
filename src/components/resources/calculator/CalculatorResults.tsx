import React from 'react';
import { CalculatorResults as ResultsType } from './types';

interface CalculatorResultsProps {
  results: ResultsType;
}

export default function CalculatorResults({ results }: CalculatorResultsProps) {
  const resultItems = [
    { label: 'Total Loan Amount', value: `$${results.loanAmount.toLocaleString()}` },
    { label: 'Cash Required', value: `$${results.cashRequired.toLocaleString()}` },
    { label: 'Total All-In Cost', value: `$${results.totalAllIn.toLocaleString()}` },
    { label: '% of ARV (Hold)', value: `${results.arvPercentage.toFixed(1)}%` },
    { label: 'Net Operating Income (Monthly)', value: `$${results.noi.toLocaleString()}` },
    { label: 'Equity at End of Deal', value: `$${results.equityEnd.toLocaleString()}` },
    { label: 'Monthly Cash Flow', value: `$${results.monthlyCashFlow.toLocaleString()}` },
    { label: 'Cash-on-Cash Return (Annual)', value: `${results.cashOnCash.toFixed(1)}%` }
  ];

  return (
    <div id="results" className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Results</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {resultItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-600 dark:text-gray-300">{item.label}:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}