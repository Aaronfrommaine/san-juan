import React from 'react';
import { Globe } from 'lucide-react';

interface LeadSourcesChartProps {
  data: [string, number][];
}

export default function LeadSourcesChart({ data }: LeadSourcesChartProps) {
  const total = data.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lead Sources</h3>
        <Globe className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="space-y-4">
        {data.map(([source, count]) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return (
            <div key={source}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {source}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}