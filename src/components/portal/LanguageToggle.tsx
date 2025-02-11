import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../lib/context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className="p-2 rounded-lg transition-colors dark:text-white flex items-center gap-2"
      aria-label="Toggle language"
    >
      <Globe className="h-5 w-5" />
      <span className="text-sm font-medium">{language.toUpperCase()}</span>
    </button>
  );
}