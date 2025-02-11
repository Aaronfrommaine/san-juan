import React, { useState } from 'react';
import { Users, MessageCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';
import { useAttendees } from '../../lib/hooks/useAttendees';
import { useSeminars } from '../../lib/hooks/useSeminars';
import AttendeeList from './networking/AttendeeList';
import ProfessionalsList from './networking/ProfessionalsList';
import GroupChat from './networking/GroupChat';
import GroupAnnouncement from './networking/GroupAnnouncement';

type Tab = 'attendees' | 'professionals' | 'chat' | 'announcements';

export default function NetworkingHub() {
  const { user } = useAuth();
  const { seminars } = useSeminars();
  const [activeTab, setActiveTab] = useState<Tab>('attendees');
  
  // Get the user's upcoming seminar
  const upcomingSeminar = seminars.find(s => s.status === 'upcoming');
  
  // Only fetch attendees when needed
  const { attendees, isLoading, error } = useAttendees(
    activeTab === 'attendees' ? upcomingSeminar?.id : undefined
  );

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setActiveTab('attendees')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'attendees'
              ? 'bg-yellow-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          Connect with Fellow Investors
        </button>
        
        {upcomingSeminar && (
          <>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'chat'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Group Chat
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'announcements'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Announcements
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('professionals')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'professionals'
              ? 'bg-yellow-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Briefcase className="h-5 w-5 mr-2" />
          RE Professionals
        </button>
      </div>

      {activeTab === 'attendees' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          {error ? (
            <div className="text-center text-red-600 dark:text-red-400 p-4">
              Failed to load attendees. Please try again later.
            </div>
          ) : (
            <AttendeeList 
              attendees={attendees} 
              isLoading={isLoading}
            />
          )}
        </div>
      )}

      {activeTab === 'chat' && upcomingSeminar && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <GroupChat seminarId={upcomingSeminar.id} />
        </div>
      )}

      {activeTab === 'announcements' && upcomingSeminar && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <GroupAnnouncement seminarId={upcomingSeminar.id} />
        </div>
      )}

      {activeTab === 'professionals' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <ProfessionalsList />
        </div>
      )}
    </div>
  );
}