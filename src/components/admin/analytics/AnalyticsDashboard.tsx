import React, { useState, useEffect } from 'react';
import { BarChart, Users, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import LeadSourcesChart from './LeadSourcesChart';
import ConversionMetrics from './ConversionMetrics';
import CampaignPerformance from './CampaignPerformance';

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7d');
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    conversionRate: 0,
    topSources: [],
    campaignPerformance: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Get date range
      const now = new Date();
      const start = new Date();
      switch (dateRange) {
        case '7d':
          start.setDate(start.getDate() - 7);
          break;
        case '30d':
          start.setDate(start.getDate() - 30);
          break;
        case '90d':
          start.setDate(start.getDate() - 90);
          break;
      }

      // Fetch analytics data
      const { data, error } = await supabase
        .from('lead_tracking')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', now.toISOString());

      if (error) throw error;

      // Process data
      const leads = data || [];
      const sources = leads.reduce((acc: any, lead) => {
        const source = lead.utm_source || 'direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      const campaigns = leads.reduce((acc: any, lead) => {
        const campaign = lead.utm_campaign || 'none';
        acc[campaign] = (acc[campaign] || 0) + 1;
        return acc;
      }, {});

      // Calculate conversion rate (bookings / leads)
      const { data: bookings } = await supabase
        .from('bookings')
        .select('created_at')
        .gte('created_at', start.toISOString())
        .lte('created_at', now.toISOString());

      const conversionRate = bookings ? 
        ((bookings.length / leads.length) * 100).toFixed(1) : 0;

      setMetrics({
        totalLeads: leads.length,
        conversionRate: Number(conversionRate),
        topSources: Object.entries(sources)
          .sort(([,a]: any, [,b]: any) => b - a)
          .slice(0, 5),
        campaignPerformance: Object.entries(campaigns)
          .map(([name, count]) => ({
            name,
            leads: count as number
          }))
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart className="h-5 w-5 text-yellow-500" />
          Analytics Dashboard
        </h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Leads</h3>
            <Users className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{metrics.totalLeads}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Conversion Rate</h3>
            <TrendingUp className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{metrics.conversionRate}%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Time Period</h3>
            <Calendar className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {dateRange === '7d' ? 'Week' : dateRange === '30d' ? 'Month' : 'Quarter'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadSourcesChart data={metrics.topSources} />
        <ConversionMetrics conversionRate={metrics.conversionRate} />
      </div>

      {/* Campaign Performance */}
      <CampaignPerformance campaigns={metrics.campaignPerformance} />
    </div>
  );
}