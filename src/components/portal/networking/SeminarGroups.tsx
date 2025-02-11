import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { SeminarGroup } from '../../../lib/types/networking';

interface SeminarGroupsProps {
  groups: SeminarGroup[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function SeminarGroups({ groups, activeId, onSelect }: SeminarGroupsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-white mb-4">Your Seminar Groups</h3>
      {groups.map((group) => (
        <button
          key={group.id}
          onClick={() => onSelect(group.id)}
          className={`w-full p-4 rounded-lg transition-colors ${
            activeId === group.id
              ? 'bg-yellow-500 text-white'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {new Date(group.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>{group.memberCount}</span>
            </div>
          </div>
          <p className="text-sm text-left">
            {group.location}
          </p>
        </button>
      ))}
    </div>
  );
}