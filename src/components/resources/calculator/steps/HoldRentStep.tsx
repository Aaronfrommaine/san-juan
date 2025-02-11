import React from 'react';

interface HoldRentStepProps {
  data: {
    arvRent: number;
    monthsToRent: number;
    projIncome: number;
    projExpenses: number;
    refinance: 'Yes' | 'No';
    mortgagePayment: number;
  };
  onChange: (data: Partial<HoldRentStepProps['data']>) => void;
}

export default function HoldRentStep({ data, onChange }: HoldRentStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Hold/Rent Details</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">After Repair Value (ARV)</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={data.arvRent}
            onChange={(e) => onChange({ arvRent: Number(e.target.value) })}
            className="pl-7 w-full rounded-lg border-gray-300"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Months to Rent</label>
        <input
          type="number"
          value={data.monthsToRent}
          onChange={(e) => onChange({ monthsToRent: Number(e.target.value) })}
          className="w-full rounded-lg border-gray-300"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Projected Monthly Income</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={data.projIncome}
            onChange={(e) => onChange({ projIncome: Number(e.target.value) })}
            className="pl-7 w-full rounded-lg border-gray-300"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Projected Monthly Expenses</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={data.projExpenses}
            onChange={(e) => onChange({ projExpenses: Number(e.target.value) })}
            className="pl-7 w-full rounded-lg border-gray-300"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Plan to Refinance?</label>
        <select
          value={data.refinance}
          onChange={(e) => onChange({ refinance: e.target.value as 'Yes' | 'No' })}
          className="w-full rounded-lg border-gray-300"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Monthly Mortgage Payment</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={data.mortgagePayment}
            onChange={(e) => onChange({ mortgagePayment: Number(e.target.value) })}
            className="pl-7 w-full rounded-lg border-gray-300"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}