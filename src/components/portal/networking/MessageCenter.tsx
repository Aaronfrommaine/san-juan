import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useMessaging } from '../../../lib/hooks/useMessaging';
import MessageThread from './MessageThread';
import { Thread } from '../../../lib/types/messaging';

interface MessageCenterProps {
  recipientId: string;
  onClose: () => void;
}

export default function MessageCenter({ recipientId, onClose }: MessageCenterProps) {
  const { user } = useAuth();
  const { threads, createThread, isLoading } = useMessaging();
  const [activeThread, setActiveThread] = useState<Thread | null>(null);

  // Find existing thread with recipient
  const existingThread = threads.find(thread => 
    thread.participants.includes(recipientId) && thread.participants.includes(user?.id || '')
  );

  const handleStartChat = async () => {
    if (existingThread) {
      setActiveThread(existingThread);
    } else {
      try {
        const newThread = await createThread(recipientId);
        setActiveThread(newThread);
      } catch (error) {
        console.error('Failed to create thread:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        {activeThread ? (
          <MessageThread thread={activeThread} onClose={onClose} />
        ) : (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium mb-4">Start a Conversation</h3>
            <button
              onClick={handleStartChat}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
            >
              Start Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}