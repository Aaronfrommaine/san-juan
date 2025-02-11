import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useMembers } from '../../../lib/hooks/useMembers';

interface MemberListProps {
  seminarId: string;
}

export default function MemberList({ seminarId }: MemberListProps) {
  const { members, isLoading } = useMembers(seminarId);

  if (isLoading) {
    return <div className="p-4">Loading members...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-white mb-4">
        Group Members ({members.length})
      </h3>
      
      {members.map((member) => (
        <div 
          key={member.id}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg"
        >
          <div className="font-medium mb-2">
            {member.firstName} {member.lastName}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {member.company}
          </div>
          <div className="space-y-2">
            <a
              href={`mailto:${member.email}`}
              className="flex items-center text-sm text-yellow-600 hover:text-yellow-500"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </a>
            <a
              href={`tel:${member.phone}`}
              className="flex items-center text-sm text-yellow-600 hover:text-yellow-500"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}