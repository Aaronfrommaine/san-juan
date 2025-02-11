import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { InvestorResult } from '../../lib/types/questionnaire';

interface ResultCardProps {
  result: InvestorResult;
  onRestart: () => void;
}

export default function ResultCard({ result, onRestart }: ResultCardProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {result.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {result.description}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Recommendations
          </h4>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Next Steps
          </h4>
          <ul className="space-y-3">
            {result.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Take Quiz Again
        </button>
      </div>
    </div>
  );
}