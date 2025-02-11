import React from 'react';
import { Trophy, Users, Calendar } from 'lucide-react';
import { Profile } from '../../../lib/types/profile';

interface ProfileStatsProps {
  profile: Profile;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.badges.length}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Badges Earned
        </div>
      </div>

      <div className="text-center border-x border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center mb-2">
          <Users className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.investment_focus.length}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Focus Areas
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Calendar className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {new Date(profile.created_at).getFullYear()}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Member Since
        </div>
      </div>
    </div>
  );
}