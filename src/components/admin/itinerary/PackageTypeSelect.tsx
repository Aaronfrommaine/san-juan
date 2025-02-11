import React from 'react';
import { PackageType } from '../../../lib/types/itinerary';

interface PackageTypeSelectProps {
  value: PackageType;
  onChange: (value: PackageType) => void;
}

export default function PackageTypeSelect({ value, onChange }: PackageTypeSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Package Type</label>
      <select
        required
        value={value}
        onChange={e => onChange(e.target.value as PackageType)}
        className="w-full rounded-lg border-gray-300"
      >
        <option value="standard">Standard Package</option>
        <option value="vip">VIP Package</option>
        <option value="elite">Elite Package</option>
      </select>
    </div>
  );
}