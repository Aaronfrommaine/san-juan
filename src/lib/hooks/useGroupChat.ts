import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Message } from '../types/messaging';

export function useGroupChat(seminarId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMessages() {
      try {
        const { data, error: messagesError } = await supabase
          .from('chat_messages')
          .select(`
            *,
            sender:sender_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('seminar_id', seminarId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        if (mounted) {
          setMessages(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching group messages:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`seminar:${seminarId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `seminar_id=eq.${seminarId}`
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [seminarId]);

  const sendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          seminar_id: seminarId,
          sender_id: user.id,
          content
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  return { messages, sendMessage, isLoading, error };
}