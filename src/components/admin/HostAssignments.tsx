import React from 'react';
import { useProfile } from '../../lib/hooks/useProfile';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Seminar = Database['public']['Tables']['seminars']['Row'];

interface HostAssignmentsProps {
  seminar: Seminar;
  onUpdate?: () => void;
}

export default function HostAssignments({ seminar, onUpdate }: HostAssignmentsProps) {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id || '');
  const [isAssigned, setIsAssigned] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAssignment();
  }, [seminar.id]);

  async function checkAssignment() {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('host_assignments')
        .select('*')
        .eq('seminar_id', seminar.id)
        .eq('host_id', user.id);
      
      if (error) throw error;
      setIsAssigned(data && data.length > 0);
    } catch (error) {
      console.error('Error checking host assignment:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleHostAssignment() {
    if (!user?.id || !profile?.is_host) return;

    try {
      setIsLoading(true);
      
      if (isAssigned) {
        const { error: deleteError } = await supabase
          .from('host_assignments')
          .delete()
          .eq('seminar_id', seminar.id)
          .eq('host_id', user.id);

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from('host_assignments')
          .insert({
            seminar_id: seminar.id,
            host_id: user.id
          });

        if (insertError) throw insertError;
      }

      setIsAssigned(!isAssigned);
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling host assignment:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!profile?.is_host) return null;

  return (
    <button
      onClick={toggleHostAssignment}
      disabled={isLoading}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        isAssigned
          ? 'bg-yellow-500 text-black hover:bg-yellow-400'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      {isLoading ? 'Loading...' : isAssigned ? 'Hosting' : 'Host Seminar'}
    </button>
  );
}