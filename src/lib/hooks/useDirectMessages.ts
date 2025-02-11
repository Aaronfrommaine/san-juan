import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  read_at: string | null;
}

export function useDirectMessages(otherUserId: string, seminarId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMessages() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .eq('seminar_id', seminarId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        if (mounted) {
          setMessages(data || []);
          setError(null);
        }

        // Mark messages as read
        await supabase.rpc('mark_messages_read', {
          other_user_uuid: otherUserId
        });
      } catch (err) {
        console.error('Error fetching messages:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    const subscription = supabase
      .channel(`direct_messages:${otherUserId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `sender_id=eq.${otherUserId}`
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    fetchMessages();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [otherUserId, seminarId]);

  const sendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: otherUserId,
          content,
          seminar_id: seminarId
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  return { messages, isLoading, error, sendMessage };
}