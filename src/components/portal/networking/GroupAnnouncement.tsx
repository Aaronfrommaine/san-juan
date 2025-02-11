import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useGroupAnnouncements } from '../../../lib/hooks/useGroupAnnouncements';

interface GroupAnnouncementProps {
  seminarId: string;
}

export default function GroupAnnouncement({ seminarId }: GroupAnnouncementProps) {
  const [message, setMessage] = useState('');
  const { announcements, isLoading, error, canPost, postAnnouncement } = useGroupAnnouncements(seminarId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await postAnnouncement(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to post announcement:', error);
      alert('Failed to post announcement. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>Failed to load announcements</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canPost && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Post an announcement to all seminar attendees..."
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 flex items-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Post Announcement
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-gray-500">No announcements yet</div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">
                    {announcement.author?.first_name} {announcement.author?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(announcement.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{announcement.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}