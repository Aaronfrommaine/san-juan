import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../components/auth/AuthProvider';

export function useChecklist(key: string, items: { id: string }[]) {
  const { user } = useAuth();
  const [checkedItems, setCheckedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem(`checklist-${key}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`checklist-${key}`, JSON.stringify(checkedItems));

    // Only manage badge if user is authenticated
    if (!user) return;

    const manageBadge = async () => {
      try {
        // Get the Travel Ready badge ID
        const { data: badge } = await supabase
          .from('badges')
          .select('id')
          .eq('name', 'Travel Ready')
          .single();

        if (!badge) return;

        if (checkedItems.length === items.length) {
          // Award badge if all items are checked
          const { error } = await supabase
            .from('awarded_badges')
            .upsert({
              user_id: user.id,
              badge_id: badge.id,
              metadata: {
                checklist: key,
                completed_at: new Date().toISOString()
              }
            }, {
              onConflict: 'user_id,badge_id'
            });

          if (error && error.code !== '23505') throw error;
        } else {
          // Remove badge if not all items are checked
          const { error } = await supabase
            .from('awarded_badges')
            .delete()
            .match({
              user_id: user.id,
              badge_id: badge.id
            });

          if (error) throw error;
        }
      } catch (error) {
        console.error('Error managing badge:', error);
      }
    };

    manageBadge();
  }, [checkedItems, key, items.length, user]);

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return { checkedItems, toggleItem };
}