import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Message } from '../types/networking';

export function useChat(seminarId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel(`seminar:${seminarId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `seminar_id=eq.${seminarId}`
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    // Fetch existing messages
    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [seminarId]);

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('seminar_id', seminarId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data.map(msg => ({
        id: msg.id,
        content: msg.content,
        userId: msg.user_id,
        userName: `${msg.profiles.first_name} ${msg.profiles.last_name}`,
        timestamp: msg.created_at
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(content: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          seminar_id: seminarId,
          user_id: user.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  return { messages, sendMessage, isLoading };
}