import React, { useState } from 'react';
import { CalculatorResults } from './types';
import PurchaseStep from './steps/PurchaseStep';
import RehabStep from './steps/RehabStep';
import FinancingStep from './steps/FinancingStep';
import HoldRentStep from './steps/HoldRentStep';

interface CalculatorStepsProps {
  onCalculate: (formData: any) => CalculatorResults;
}

export default function CalculatorSteps({ onCalculate }: CalculatorStepsProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Purchase
    purchasePrice: 70000,
    closingCosts: 1500,
    holdingCosts: 1500,
    includeInLoan: 'Yes',
    
    // Rehab
    rehabBudget: 10000,
    rehabMonths: 2,
    
    // Financing
    financingType: 'Financing',
    lenderCaps: 'cost',
    maxPercentFinanced: 90,
    originationPoints: 3,
    otherLenderCosts: 0,
    pointsTiming: 'Backend',
    interestRate: 10,
    interestDuringRehab: 'No',
    profitSplit: 'No',
    
    // Hold/Rent
    arvRent: 100000,
    monthsToRent: 2,
    projIncome: 1100,
    projExpenses: 250,
    refinance: 'No',
    mortgagePayment: 663
  });

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const handleCalculate = () => {
    const results = onCalculate(formData);
    // Scroll to results
    const resultsElement = document.getElementById('results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['Purchase', 'Rehab', 'Financing', 'Hold/Rent'].map((step, index) => (
          <button
            key={step}
            onClick={() => handleStepChange(index + 1)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStep === index + 1
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {step}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        {activeStep === 1 && (
          <PurchaseStep
            data={formData}
            onChange={data => setFormData(prev => ({ ...prev, ...data }))}
          />
        )}
        {activeStep === 2 && (
          <RehabStep
            data={formData}
            onChange={data => setFormData(prev => ({ ...prev, ...data }))}
          />
        )}
        {activeStep === 3 && (
          <FinancingStep
            data={formData}
            onChange={data => setFormData(prev => ({ ...prev, ...data }))}
          />
        )}
        {activeStep === 4 && (
          <HoldRentStep
            data={formData}
            onChange={data => setFormData(prev => ({ ...prev, ...data }))}
          />
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCalculate}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
          >
            Calculate Deal
          </button>
        </div>
      </div>
    </div>
  );
}