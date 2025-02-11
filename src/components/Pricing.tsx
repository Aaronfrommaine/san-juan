import React, { useState } from 'react';
import { Check, Star, Crown, ArrowRight, Briefcase } from 'lucide-react';
import BookingModal from './booking/BookingModal';
import { useAuth } from './auth/AuthProvider';
import { useEasterEgg } from '../lib/hooks/useEasterEgg';
import EasterEggToast from './EasterEggToast';
import { plans } from '../lib/config/pricing';

export default function Pricing() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof plans[0] | null>(null);
  const { user } = useAuth();
  const { activeEgg, triggerEasterEgg } = useEasterEgg();

  const handlePackageSelect = (plan: typeof plans[0]) => {
    triggerEasterEgg();
    
    if (!user) {
      alert('Please sign in to book a package');
      return;
    }
    setSelectedPackage(plan);
    setIsBookingOpen(true);
  };

  const getCtaText = (plan: typeof plans[0]) => {
    if (plan.elite) return 'Begin Your Elite Journey';
    if (plan.highlighted) return 'Unlock VIP Perks';
    return 'Reserve Your Seat Now';
  };

  return (
    <>
      {activeEgg && (
        <EasterEggToast 
          message={activeEgg.message} 
          type={activeEgg.type} 
        />
      )}
      
      <div className="bg-gray-50 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Investment Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the package that best fits your investment goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg p-8 flex flex-col ${
                plan.elite
                  ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl'
                  : plan.highlighted
                  ? 'bg-white shadow-xl border-2 border-yellow-500'
                  : 'bg-white shadow-lg'
              }`}
            >
              {plan.highlighted ? (
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="text-yellow-500 font-semibold">
                    Most Popular
                  </span>
                </div>
              ) : plan.elite ? (
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 font-semibold">
                    Elite Experience
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-500 font-semibold">
                    Essential Package
                  </span>
                </div>
              )}
              
              <h3 className={`text-2xl font-bold mb-4 ${plan.elite ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className={`text-4xl font-bold mb-6 ${plan.elite ? 'text-white' : 'text-gray-900'}`}>
                ${plan.price.toLocaleString()}
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${
                      plan.elite ? 'text-yellow-400' : 'text-green-500'
                    }`} />
                    <span className={plan.elite ? 'text-gray-200' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePackageSelect(plan)}
                className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center ${
                  plan.elite
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                    : plan.highlighted
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {getCtaText(plan)}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedPackage(null);
        }}
        selectedPackage={selectedPackage}
      />
    </>
  );
}