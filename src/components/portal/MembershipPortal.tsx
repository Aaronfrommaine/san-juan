import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Video, Home, Plane, UserCircle } from 'lucide-react';
import Schedule from './Schedule';
import ResourceLibrary from './ResourceLibrary';
import NetworkingHub from './NetworkingHub';
import ContentHub from './ContentHub';
import PreArrivalSection from './pre-arrival/PreArrivalSection';
import ProfileManager from './profile/ProfileManager';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from '../LanguageToggle';
import { useAuth } from '../auth/AuthProvider';
import { ThemeProvider } from '../../lib/context/ThemeContext';
import { LanguageProvider } from '../../lib/context/LanguageContext';
import { useLanguage } from '../../lib/context/LanguageContext';
import { useNavigate } from 'react-router-dom';

function PortalContent() {
  const [activeTab, setActiveTab] = useState('pre-arrival');
  const { t } = useLanguage();
  const { user, isLoading, error } = useAuth();
  const navigate = useNavigate();

 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

 
  const tabs = [
    { id: 'pre-arrival', label: t('portal.nav.preArrival'), icon: Plane },
    { id: 'schedule', label: t('portal.nav.schedule'), icon: Calendar },
    { id: 'network', label: t('portal.nav.network'), icon: Users },
    { id: 'resources', label: t('portal.nav.resources'), icon: FileText },
    { id: 'content', label: t('portal.nav.content'), icon: Video },
    { id: 'profile', label: t('portal.nav.profile'), icon: UserCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('portal.title')}
          </h1>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              {t('portal.back')}
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
          {activeTab === 'pre-arrival' && <PreArrivalSection />}
          {activeTab === 'schedule' && <Schedule />}
          {activeTab === 'network' && <NetworkingHub />}
          {activeTab === 'resources' && <ResourceLibrary />}
          {activeTab === 'content' && <ContentHub />}
          {activeTab === 'profile' && <ProfileManager />}
        </div>
      </div>
    </div>
  );
}

export default function MembershipPortal() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PortalContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}