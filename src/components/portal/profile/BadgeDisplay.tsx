import React from 'react';
import { Award, Star, Trophy, Target, Users, Rocket } from 'lucide-react';
import { Badge } from '../../../lib/types/profile';

interface BadgeDisplayProps {
  badges: Badge[];
}

const categoryIcons: Record<string, typeof Award> = {
  onboarding: Rocket,
  education: Star,
  achievement: Trophy,
  community: Users,
  contribution: Target,
  preparation: Award
};

const categoryColors: Record<string, string> = {
  onboarding: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
  education: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
  achievement: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20',
  community: 'text-green-500 bg-green-100 dark:bg-green-900/20',
  contribution: 'text-red-500 bg-red-100 dark:bg-red-900/20',
  preparation: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20'
};

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (!badges.length) return null;

  // Group badges by category
  const groupedBadges = badges.reduce((acc, badge) => {
    acc[badge.category] = acc[badge.category] || [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, Badge[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedBadges).map(([category, categoryBadges]) => {
        const Icon = categoryIcons[category] || Award;
        const colorClass = categoryColors[category] || categoryColors.achievement;

        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${colorClass.split(' ')[0]}`} />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {category} Badges
              </h4>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 ${colorClass} transition-all duration-200 hover:scale-[1.02]`}
                >
                  <div className="p-2 rounded-full bg-white dark:bg-gray-800">
                    <Icon className={`h-6 w-6 ${colorClass.split(' ')[0]}`} />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {badge.name}
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {badge.description}
                    </p>
                    {badge.awarded_at && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Awarded {new Date(badge.awarded_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}