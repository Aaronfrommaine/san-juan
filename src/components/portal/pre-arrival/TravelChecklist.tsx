import React from 'react';
import { useChecklist } from '../../../lib/hooks/useChecklist';
import { useLanguage } from '../../../lib/context/LanguageContext';

export default function TravelChecklist() {
  const { t } = useLanguage();
  
  const travelItems = [
    { id: 'flight', label: t('checklist.travel.flight') },
    { id: 'hotel', label: t('checklist.travel.hotel') },
    { id: 'transport', label: t('checklist.travel.transport') },
    { id: 'insurance', label: t('checklist.travel.insurance') },
    { id: 'weather', label: t('checklist.travel.weather') },
    { id: 'packing', label: t('checklist.travel.packing') },
    { id: 'currency', label: t('checklist.travel.currency') },
    { id: 'emergency', label: t('checklist.travel.emergency') }
  ];

  const { checkedItems, toggleItem } = useChecklist('travel-checklist', travelItems);

  return (
    <div className="space-y-3">
      {travelItems.map((item) => (
        <label
          key={item.id}
          className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <input
            type="checkbox"
            checked={checkedItems.includes(item.id)}
            onChange={() => toggleItem(item.id)}
            className="h-4 w-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
        </label>
      ))}
    </div>
  );
}