import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useProfile } from '../../../lib/hooks/useProfile';
import ProfileView from './ProfileView';
import ProfileForm from './ProfileForm';
import { Profile } from '../../../lib/types/profile';
import { useLanguage } from '../../../lib/context/LanguageContext';

export default function ProfileManager() {
  const { user } = useAuth();
  const { profile, isLoading, error, updateProfile } = useProfile(user?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {t('profile.error')}: {error.message}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (updates: Partial<Profile>) => {
    try {
      await updateProfile(updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleAvatarUpdate = async (url: string) => {
    try {
      await updateProfile({ avatar_url: url });
    } catch (error) {
      console.error('Failed to update profile with new avatar:', error);
      throw error;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('profile.subtitle')}
          </p>
        </div>

        {isEditing ? (
          <ProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView
            profile={profile}
            onEdit={() => setIsEditing(true)}
            onUpdateAvatar={handleAvatarUpdate}
          />
        )}
      </div>
    </div>
  );
}