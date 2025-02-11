import React from 'react';

interface FinancingStepProps {
  data: {
    financingType: 'Financing' | 'Cash';
    lenderCaps: 'cost' | 'arv';
    maxPercentFinanced: number;
    originationPoints: number;
    otherLenderCosts: number;
    pointsTiming: 'Upfront' | 'Backend';
    interestRate: number;
    interestDuringRehab: 'Yes' | 'No';
    profitSplit: 'Yes' | 'No';
  };
  onChange: (data: Partial<FinancingStepProps['data']>) => void;
}

export default function FinancingStep({ data, onChange }: FinancingStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Financing Details</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Financing Type</label>
        <select
          value={data.financingType}
          onChange={(e) => onChange({ financingType: e.target.value as 'Financing' | 'Cash' })}
          className="w-full rounded-lg border-gray-300"
        >
          <option value="Financing">Financing</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      {data.financingType === 'Financing' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Lender Caps Based On</label>
            <select
              value={data.lenderCaps}
              onChange={(e) => onChange({ lenderCaps: e.target.value as 'cost' | 'arv' })}
              className="w-full rounded-lg border-gray-300"
            >
              <option value="cost">Cost</option>
              <option value="arv">ARV</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max % Financed</label>
            <div className="relative">
              <input
                type="number"
                value={data.maxPercentFinanced}
                onChange={(e) => onChange({ maxPercentFinanced: Number(e.target.value) })}
                className="w-full rounded-lg border-gray-300"
                min="0"
                max="100"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate</label>
            <div className="relative">
              <input
                type="number"
                value={data.interestRate}
                onChange={(e) => onChange({ interestRate: Number(e.target.value) })}
                className="w-full rounded-lg border-gray-300"
                min="0"
                max="100"
                step="0.1"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Origination Points</label>
            <div className="relative">
              <input
                type="number"
                value={data.originationPoints}
                onChange={(e) => onChange({ originationPoints: Number(e.target.value) })}
                className="w-full rounded-lg border-gray-300"
                min="0"
              />
              <span className="absolute right-3 top-2 text-gray-500">pts</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Points Timing</label>
            <select
              value={data.pointsTiming}
              onChange={(e) => onChange({ pointsTiming: e.target.value as 'Upfront' | 'Backend' })}
              className="w-full rounded-lg border-gray-300"
            >
              <option value="Upfront">Upfront</option>
              <option value="Backend">Backend</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interest During Rehab?</label>
            <select
              value={data.interestDuringRehab}
              onChange={(e) => onChange({ interestDuringRehab: e.target.value as 'Yes' | 'No' })}
              className="w-full rounded-lg border-gray-300"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Profit Split?</label>
            <select
              value={data.profitSplit}
              onChange={(e) => onChange({ profitSplit: e.target.value as 'Yes' | 'No' })}
              className="w-full rounded-lg border-gray-300"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}