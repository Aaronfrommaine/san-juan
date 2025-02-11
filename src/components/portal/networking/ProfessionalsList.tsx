import React, { useState } from 'react';
import { Professional } from '../../../lib/types/professionals';
import ProfessionalCard from './ProfessionalCard';
import { professionals } from '../../../lib/data/professionals';

type ProfessionalType = Professional['type'];

export default function ProfessionalsList() {
  const [selectedType, setSelectedType] = useState<ProfessionalType | 'all'>('all');

  const types: { value: ProfessionalType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Professionals' },
    { value: 'attorney', label: 'Attorneys' },
    { value: 'accountant', label: 'Accountants' },
    { value: 'bookkeeper', label: 'Bookkeepers' },
    { value: 'developer', label: 'Developers' },
    { value: 'realtor', label: 'Real Estate Agents' },
    { value: 'contractor', label: 'Contractors' }
  ];

  const filteredProfessionals = selectedType === 'all'
    ? professionals
    : professionals.filter(p => p.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {types.map(type => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === type.value
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map(professional => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>
    </div>
  );
}