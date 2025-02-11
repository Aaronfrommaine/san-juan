import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ConversionMetricsProps {
  conversionRate: number;
}

export default function ConversionMetrics({ conversionRate }: ConversionMetricsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Conversion Funnel</h3>
        <TrendingUp className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
              Lead to Booking
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-yellow-600">
              {conversionRate}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
          <div
            style={{ width: `${conversionRate}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Conversion Tips</h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Follow up with leads within 24 hours</li>
          <li>• Personalize communication based on source</li>
          <li>• Focus on high-converting channels</li>
          <li>• Test different CTAs and messaging</li>
        </ul>
      </div>
    </div>
  );
}