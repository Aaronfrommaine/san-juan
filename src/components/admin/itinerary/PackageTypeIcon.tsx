import React from 'react';
import { Star, Crown } from 'lucide-react';
import { PackageType } from '../../../lib/types/itinerary';

interface PackageTypeIconProps {
  type: PackageType;
}

export default function PackageTypeIcon({ type }: PackageTypeIconProps) {
  switch (type) {
    case 'elite':
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case 'vip':
      return <Star className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
}