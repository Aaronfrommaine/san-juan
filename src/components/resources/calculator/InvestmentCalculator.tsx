import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CalculatorHeader from './CalculatorHeader';
import CalculatorSteps from './CalculatorSteps';
import CalculatorResults from './CalculatorResults';
import { useCalculator } from './useCalculator';

export default function InvestmentCalculator() {
  const navigate = useNavigate();
  const { results, calculateResults } = useCalculator();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </button>

        <CalculatorHeader />
        <CalculatorSteps onCalculate={calculateResults} />
        {results && <CalculatorResults results={results} />}

        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Disclaimer:</strong> This calculator is designed for quick analysis and fast decision-making. 
            It is not a substitute for comprehensive due diligence, professional lending advice, or detailed 
            financial modeling. Always consult qualified experts for major investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}