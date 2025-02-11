import React, { useState } from 'react';
import { PalmtreeIcon, MapPinIcon } from 'lucide-react';
import BookingModal from './booking/BookingModal';
import AuthModal from './auth/AuthModal';
import { useAuth } from './auth/AuthProvider';
import NavBar from './navigation/NavBar';
import { useLanguage } from '../lib/context/LanguageContext';

export default function Hero() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleBookingClick = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsBookingOpen(true);
    }
  };

  // When auth is successful, close auth modal and open booking
  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    setIsBookingOpen(true);
  };

  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1579687196544-08ae57ab5c11?auto=format&fit=crop&q=80"
            className="w-full h-full object-cover"
            alt={t('hero.imageAlt')}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <NavBar />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <PalmtreeIcon className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleBookingClick}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
              >
                {t('hero.cta.secure')}
              </button>
              <div className="flex items-center text-white">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{t('hero.locations')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}