import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [utmParams, setUtmParams] = useState({
    source: '',
    medium: '',
    campaign: '',
    content: '',
    term: ''
  });

  useEffect(() => {
    // Get UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    setUtmParams({
      source: urlParams.get('utm_source') || 'direct',
      medium: urlParams.get('utm_medium') || 'none',
      campaign: urlParams.get('utm_campaign') || 'none',
      content: urlParams.get('utm_content') || 'none',
      term: urlParams.get('utm_term') || 'none'
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create auth user with temporary password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: `temp${Math.random().toString(36).slice(2)}!A1`, // Random secure temp password
        options: {
          data: {
            ...utmParams,
            signup_location: 'footer',
            referrer: document.referrer || 'direct',
            signup_date: new Date().toISOString()
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned');

      // Add interested role and tracking data
      await supabase.rpc('manage_user_roles', {
        target_user_id: authData.user.id,
        new_roles: ['interested']
      });

      // Store tracking data
      await supabase.from('lead_tracking').insert({
        user_id: authData.user.id,
        email,
        utm_source: utmParams.source,
        utm_medium: utmParams.medium,
        utm_campaign: utmParams.campaign,
        utm_content: utmParams.content,
        utm_term: utmParams.term,
        referrer: document.referrer || 'direct',
        signup_location: 'footer'
      });

      setSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Error capturing email:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-6" />
          
          <h2 className="text-4xl font-bold mb-6">
            Don't Let Paradise Pass You By
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            While others are stuck in the rat race, smart investors are building their 
            legacy in Puerto Rico. Will you join them?
          </p>

          {success ? (
            <div className="bg-yellow-500/10 text-yellow-500 p-6 rounded-lg">
              <p className="text-lg font-medium">
                Welcome to the inner circle! Check your email for exclusive investment insights.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? 'Joining...' : (
                  <>
                    Join Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}