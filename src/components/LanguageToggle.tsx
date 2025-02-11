import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../lib/context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={language === 'en' ? 'Switch to Spanish' : 'Switch to English'}
    >
      <Globe className="h-5 w-5" />
      <span className="font-medium">{language === 'en' ? 'ES' : 'EN'}</span>
    </button>
  );
}