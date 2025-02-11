import React from 'react';
import { Crown, Star, Lightbulb, Building2, PalmTree } from 'lucide-react';
import { AvatarType } from '../../../lib/types/profile';

interface AvatarBadgeProps {
  type: AvatarType;
  size?: 'sm' | 'md' | 'lg';
}

const avatarIcons = {
  portfolio_powerhouse: Crown,
  heritage_builder: Building2,
  changemaker: Lightbulb,
  market_strategist: Star,
  paradise_planner: PalmTree
};

const avatarColors = {
  portfolio_powerhouse: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
  heritage_builder: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
  changemaker: 'text-green-500 bg-green-100 dark:bg-green-900/20',
  market_strategist: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20',
  paradise_planner: 'text-pink-500 bg-pink-100 dark:bg-pink-900/20'
};

export default function AvatarBadge({ type, size = 'md' }: AvatarBadgeProps) {
  const Icon = avatarIcons[type];
  const colorClass = avatarColors[type];
  
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const displayName = type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className={`inline-flex items-center rounded-full ${colorClass} ${sizeClasses[size]}`}>
      <Icon className={`${iconSizes[size]} mr-2`} />
      <span className="font-medium">{displayName}</span>
    </div>
  );
}