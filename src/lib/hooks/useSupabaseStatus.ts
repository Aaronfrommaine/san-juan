import { useState, useEffect } from 'react';
import { checkSupabaseConnection } from '../supabase';

export function useSupabaseStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkConnection = async () => {
      setIsChecking(true);
      const status = await checkSupabaseConnection();
      if (mounted) {
        setIsConnected(status);
        setIsChecking(false);
      }
    };

    checkConnection();

    // Periodic check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isConnected, isChecking };
}