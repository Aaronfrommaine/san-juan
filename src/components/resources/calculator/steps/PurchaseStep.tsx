import React from 'react';

interface PurchaseStepProps {
  data: {
    purchasePrice: number;
    closingCosts: number;
    holdingCosts: number;
    includeInLoan: 'Yes' | 'No';
  };
  onChange: (data: Partial<PurchaseStepProps['data']>) => void;
}

export default function PurchaseStep({ data, onChange }: PurchaseStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Purchase Details</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Purchase Price</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={data.purchasePrice}
            onChange={(e) => onChange({ purchasePrice: Number(e.target.value) })}
            className="pl-7 w-full rounded-lg border-gray-300"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Closing Costs</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={data.closingCosts}
            onChange={(e) => onChange({ closingCosts: Number(e.target.value) })}
            className="pl-7 w-full rounded-lg border-gray-300"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Holding Costs</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={data.holdingCosts}
            onChange={(e) => onChange({ holdingCosts: Number(e.target.value) })}
            className="pl-7 w-full rounded-lg border-gray-300"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Include in Loan?</label>
        <select
          value={data.includeInLoan}
          onChange={(e) => onChange({ includeInLoan: e.target.value as 'Yes' | 'No' })}
          className="w-full rounded-lg border-gray-300"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );
}