import React from 'react';

interface RehabStepProps {
  data: {
    rehabBudget: number;
    rehabMonths: number;
  };
  onChange: (data: Partial<RehabStepProps['data']>) => void;
}

export default function RehabStep({ data, onChange }: RehabStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Rehabilitation Details</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Rehab Budget</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={data.rehabBudget}
            onChange={(e) => onChange({ rehabBudget: Number(e.target.value) })}
            className="pl-7 w-full rounded-lg border-gray-300"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Rehab Timeline (Months)</label>
        <input
          type="number"
          value={data.rehabMonths}
          onChange={(e) => onChange({ rehabMonths: Number(e.target.value) })}
          className="w-full rounded-lg border-gray-300"
          min="0"
        />
      </div>
    </div>
  );
}