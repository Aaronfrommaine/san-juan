import React, { useState } from 'react';
import SeminarGroups from './SeminarGroups';
import ChatRoom from './ChatRoom';
import MemberList from './MemberList';
import { useSeminarGroups } from '../../../lib/hooks/useSeminarGroups';

export default function NetworkingHub() {
  const [activeSeminarId, setActiveSeminarId] = useState<string | null>(null);
  const { groups, isLoading, error } = useSeminarGroups();

  if (isLoading) {
    return <div className="p-6 text-center">Loading networking groups...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6">
      <div className="lg:col-span-1">
        <SeminarGroups
          groups={groups}
          activeId={activeSeminarId}
          onSelect={setActiveSeminarId}
        />
      </div>
      
      <div className="lg:col-span-2">
        {activeSeminarId ? (
          <ChatRoom seminarId={activeSeminarId} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a seminar group to start chatting
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        {activeSeminarId && <MemberList seminarId={activeSeminarId} />}
      </div>
    </div>
  );
}