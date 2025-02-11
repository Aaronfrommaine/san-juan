import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Profile } from '../types/profile';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    async function fetchProfile() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // First check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            awarded_badges (
              badge_id,
              awarded_at,
              badges (
                id,
                name,
                description,
                icon_url,
                category
              )
            )
          `)
          .eq('id', userId)
          .maybeSingle();

        if (profileError) throw profileError;

        // If no profile exists, create one
        if (!profileData) {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) throw new Error('No user found');

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              first_name: userData.user.email?.split('@')[0] || '',
              last_name: '',
              investment_focus: []
            })
            .select()
            .single();

          if (createError) throw createError;
          
          if (isMounted) {
            setProfile({ ...newProfile, badges: [] });
            setError(null);
          }
          return;
        }

        // Transform badges data
        const badges = profileData.awarded_badges?.map(award => ({
          ...award.badges,
          awarded_at: award.awarded_at
        })) || [];

        if (isMounted) {
          setProfile({ ...profileData, badges });
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
          
          // Retry logic with exponential backoff
          if (retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
            retryTimeout = setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, delay);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [userId, retryCount]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const retry = () => {
    setRetryCount(0);
    setError(null);
    setIsLoading(true);
  };

  return { 
    profile, 
    isLoading, 
    error, 
    updateProfile,
    retry // Allow manual retry
  };
}