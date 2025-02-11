import React, { useState } from 'react';
import { Profile } from '../../../lib/types/profile';
import { useLanguage } from '../../../lib/context/LanguageContext';

interface ProfileFormProps {
  profile: Profile | null;
  onSubmit: (updates: Partial<Profile>) => Promise<void>;
  onCancel: () => void;
}

const INVESTMENT_FOCUS_OPTIONS = [
  'Residential',
  'Commercial',
  'Mixed-Use',
  'Hospitality',
  'Land Development',
  'Sustainable Projects',
  'Historic Properties',
  'Luxury Real Estate',
  'Income Properties',
  'Opportunity Zones'
];

export default function ProfileForm({ profile, onSubmit, onCancel }: ProfileFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    title: profile?.title || '',
    company: profile?.company || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    investment_focus: profile?.investment_focus || [],
    linkedin_url: profile?.linkedin_url || '',
    website_url: profile?.website_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const toggleFocus = (focus: string) => {
    setFormData(prev => ({
      ...prev,
      investment_focus: prev.investment_focus.includes(focus)
        ? prev.investment_focus.filter(f => f !== focus)
        : [...prev.investment_focus, focus]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {profile ? t('profile.edit') : t('profile.create')}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.form.firstName')}
            </label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.form.lastName')}
            </label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.form.title')}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.form.company')}
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('profile.form.bio')}
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('profile.form.location')}
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.form.focus')}
          </label>
          <div className="flex flex-wrap gap-2">
            {INVESTMENT_FOCUS_OPTIONS.map((focus) => (
              <button
                key={focus}
                type="button"
                onClick={() => toggleFocus(focus)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.investment_focus.includes(focus)
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {focus}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.form.linkedin')}
            </label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={e => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.form.website')}
            </label>
            <input
              type="url"
              value={formData.website_url}
              onChange={e => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {t('profile.form.cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          {t('profile.form.save')}
        </button>
      </div>
    </form>
  );
}