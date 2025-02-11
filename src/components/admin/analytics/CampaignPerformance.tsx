import React from 'react';
import { Target } from 'lucide-react';

interface Campaign {
  name: string;
  leads: number;
}

interface CampaignPerformanceProps {
  campaigns: Campaign[];
}

export default function CampaignPerformance({ campaigns }: CampaignPerformanceProps) {
  const sortedCampaigns = [...campaigns].sort((a, b) => b.leads - a.leads);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Performance</h3>
        <Target className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Leads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Performance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedCampaigns.map((campaign) => (
              <tr key={campaign.name}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {campaign.name === 'none' ? 'Direct' : campaign.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {campaign.leads}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${(campaign.leads / Math.max(...campaigns.map(c => c.leads))) * 100}%`
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}