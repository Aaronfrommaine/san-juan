import { useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../components/auth/AuthProvider';

export function useChecklistCompletion(listId: string, checkedItems: string[], totalItems: string[]) {
  const { user } = useAuth();

  useEffect(() => {
    async function handleCompletion() {
      if (!user || checkedItems.length < totalItems.length) return;

      try {
        // Award travel badge when all items are checked
        const { error } = await supabase
          .from('awarded_badges')
          .insert({
            user_id: user.id,
            badge_id: (await supabase
              .from('badges')
              .select('id')
              .eq('name', 'Travel Ready')
              .single()
            ).data?.id,
            metadata: {
              awarded_for: 'Completed travel preparation checklist',
              completed_at: new Date().toISOString(),
              checklist_id: listId
            }
          })
          .select()
          .single();

        if (error && error.code !== '23505') { // Ignore unique violation
          throw error;
        }
      } catch (err) {
        console.error('Error awarding travel badge:', err);
      }
    }

    if (checkedItems.length === totalItems.length) {
      handleCompletion();
    }
  }, [user, listId, checkedItems.length, totalItems.length]);
}
</boltArtifact>

3. Update the TravelChecklist component to use the new hook:

<boltArtifact id="update-travel-checklist" title="Update Travel Checklist">
<boltAction type="file" filePath="src/components/portal/pre-arrival/TravelChecklist.tsx">
import React from 'react';
import { useChecklist } from '../../../lib/hooks/useChecklist';
import { useChecklistCompletion } from '../../../lib/hooks/useChecklistCompletion';
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
  
  // Monitor checklist completion
  useChecklistCompletion(
    'travel-checklist',
    checkedItems,
    travelItems.map(item => item.id)
  );

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