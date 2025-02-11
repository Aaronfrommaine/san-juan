import { useState } from 'react';
import { BookingFormData } from './types';
import { supabase } from '../../lib/supabase';
import { createCheckoutSession } from '../../lib/stripe';

export function useBooking() {
  const [isLoading, setIsLoading] = useState(false);

  const submitBooking = async (formData: BookingFormData) => {
    setIsLoading(true);
    try {
      // First ensure user is signed in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to complete your booking');
      }

      // Get package price
      const packagePrices = {
        'Standard Package': 2500,
        'VIP Package': 5000,
        'Elite Package': 7500
      };

      const price = packagePrices[formData.package as keyof typeof packagePrices];
      if (!price) {
        throw new Error('Invalid package selected');
      }

      // Create temporary booking record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          seminar_id: formData.seminarId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          investment_goals: formData.investmentGoals,
          package_name: formData.package,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Redirect to Stripe checkout
      await createCheckoutSession({
        package: formData.package,
        price,
        seminarId: formData.seminarId,
        userId: user.id
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { submitBooking, isLoading };
}