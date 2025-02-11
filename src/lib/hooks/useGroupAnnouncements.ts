import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface Announcement {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  author?: {
    first_name: string;
    last_name: string;
  };
}

export function useGroupAnnouncements(seminarId: string) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [canPost, setCanPost] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchAnnouncements() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if user can post announcements
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        const userRoles = roles?.map(r => r.role) || [];
        setCanPost(userRoles.some(role => ['admin', 'host'].includes(role)));

        // Fetch announcements
        const { data, error } = await supabase
          .from('group_announcements')
          .select(`
            *,
            author:author_id (
              first_name,
              last_name
            )
          `)
          .eq('seminar_id', seminarId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (mounted) {
          setAnnouncements(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch announcements'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    const subscription = supabase
      .channel(`announcements:${seminarId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'group_announcements',
        filter: `seminar_id=eq.${seminarId}`
      }, (payload) => {
        setAnnouncements(current => [payload.new as Announcement, ...current]);
      })
      .subscribe();

    fetchAnnouncements();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [seminarId]);

  const postAnnouncement = async (content: string) => {
    if (!canPost) throw new Error('Not authorized to post announcements');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('group_announcements')
        .insert({
          seminar_id: seminarId,
          author_id: user.id,
          content
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error posting announcement:', err);
      throw err;
    }
  };

  return { announcements, isLoading, error, canPost, postAnnouncement };
}