import React from 'react';
import { Edit2, Building2, MapPin, Globe, Linkedin } from 'lucide-react';
import { Profile } from '../../../lib/types/profile';
import { useLanguage } from '../../../lib/context/LanguageContext';
import ProfilePictureUploader from './ProfilePictureUploader';
import BadgeDisplay from './BadgeDisplay';
import ProfileStats from './ProfileStats';

interface ProfileViewProps {
  profile: Profile | null;
  onEdit: () => void;
  onUpdateAvatar: (url: string) => Promise<void>;
}

export default function ProfileView({ profile, onEdit, onUpdateAvatar }: ProfileViewProps) {
  const { t } = useLanguage();

  if (!profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('profile.form.create')}
        </p>
        <button
          onClick={onEdit}
          className="inline-flex items-center px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <Edit2 className="h-5 w-5 mr-2" />
          {t('profile.form.edit')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-8">
          <div className="flex justify-end">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {t('profile.form.edit')}
            </button>
          </div>

          <ProfilePictureUploader profile={profile} onUpdate={onUpdateAvatar} />
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.first_name} {profile.last_name}
            </h2>
            {profile.title && profile.company && (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 mt-2">
                <Building2 className="h-4 w-4 mr-2" />
                <span>{profile.title} at {profile.company}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>

          <ProfileStats profile={profile} />
        </div>

        {profile.bio && (
          <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('profile.form.bio')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {profile.investment_focus.length > 0 && (
          <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('profile.form.focus')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.investment_focus.map((focus, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-6">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </a>
            )}
            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400"
              >
                <Globe className="h-5 w-5 mr-2" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {profile.badges.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t('profile.achievements')}
          </h3>
          <BadgeDisplay badges={profile.badges} />
        </div>
      )}
    </div>
  );
}