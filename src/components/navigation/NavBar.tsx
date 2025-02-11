import React, { useState } from 'react';
import { Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../auth/UserMenu';
import { useAuth } from '../auth/AuthProvider';
import AuthModal from '../auth/AuthModal';
import { useLanguage } from '../../lib/context/LanguageContext';

export default function NavBar() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  
  const handleAdminAccess = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div /> {/* Empty div for layout balance */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Globe className="h-5 w-5 mr-2" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>
            <button
              onClick={handleAdminAccess}
              className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Shield className="h-5 w-5 mr-2" />
              Admin Access
            </button>
            <UserMenu />
          </div>
        </div>
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}