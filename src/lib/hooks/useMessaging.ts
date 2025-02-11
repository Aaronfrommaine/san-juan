import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Message, Thread } from '../types/messaging';

export function useMessaging() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchThreads() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error: threadsError } = await supabase
          .from('message_threads')
          .select(`
            *,
            thread_messages (
              id,
              sender_id,
              content,
              created_at,
              read_at
            )
          `)
          .contains('participants', [user.id])
          .order('updated_at', { ascending: false });

        if (threadsError) throw threadsError;

        if (mounted) {
          setThreads(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching threads:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch threads'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchThreads();

    // Subscribe to new messages
    const subscription = supabase
      .channel('thread_messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'thread_messages'
      }, () => {
        fetchThreads();
      })
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const sendMessage = async (threadId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('thread_messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const createThread = async (recipientId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('message_threads')
        .insert({
          participants: [user.id, recipientId]
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating thread:', err);
      throw err;
    }
  };

  return {
    threads,
    isLoading,
    error,
    sendMessage,
    createThread
  };
}