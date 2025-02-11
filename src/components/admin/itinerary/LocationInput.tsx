import React from 'react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function LocationInput({ value, onChange, placeholder }: LocationInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Address</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border-gray-300"
      />
    </div>
  );
}