import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../components/auth/AuthProvider';

interface TravelDetails {
  airline: string;
  flightNumber: string;
  arrivalTime: string;
  departureTime: string;
}

export function useTravelDetails() {
  const { user } = useAuth();
  const [travelDetails, setTravelDetails] = useState<TravelDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchTravelDetails() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('travel_details')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single

        if (error && error.code !== 'PGRST116') throw error;
        
        if (mounted && data) {
          setTravelDetails({
            airline: data.airline,
            flightNumber: data.flight_number,
            arrivalTime: data.arrival_time,
            departureTime: data.departure_time
          });
          setError(null);
        } else {
          setTravelDetails(null);
        }
      } catch (err) {
        console.error('Error fetching travel details:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch travel details'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTravelDetails();

    return () => {
      mounted = false;
    };
  }, [user]);

  const updateTravelDetails = async (details: TravelDetails) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('travel_details')
        .upsert({
          user_id: user.id,
          airline: details.airline,
          flight_number: details.flightNumber,
          arrival_time: details.arrivalTime,
          departure_time: details.departureTime
        })
        .select()
        .single();

      if (error) throw error;
      
      setTravelDetails(details);
      setError(null);
    } catch (err) {
      console.error('Error updating travel details:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    travelDetails,
    updateTravelDetails,
    isLoading,
    error
  };
}