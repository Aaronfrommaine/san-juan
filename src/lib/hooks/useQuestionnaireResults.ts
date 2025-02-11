import { useState } from 'react';
import { supabase } from '../supabase';
import { InvestorType } from '../types/questionnaire';
import { AvatarType } from '../types/profile';

// Map questionnaire results to valid avatar types
const avatarTypeMap: Record<InvestorType, AvatarType> = {
  hnw: 'portfolio_powerhouse',
  diaspora: 'heritage_builder',
  impact: 'changemaker',
  institutional: 'market_strategist',
  lifestyle: 'paradise_planner'
};

export function useQuestionnaireResults() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitResults = async (type: InvestorType) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Convert questionnaire type to valid avatar type
      const avatarType = avatarTypeMap[type];
      if (!avatarType) throw new Error('Invalid investor type');

      // Update profile with results
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_type: avatarType,
          avatar_result: {
            type,
            completed_at: new Date().toISOString()
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error submitting questionnaire results:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitResults, isSubmitting };
}