import React from 'react';
import { Message } from '../../../lib/types/networking';
import { useAuth } from '../../auth/AuthProvider';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth();
  const isOwnMessage = message.userId === user?.id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${
        isOwnMessage 
          ? 'bg-yellow-500 text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        } rounded-lg p-3`}
      >
        {!isOwnMessage && (
          <div className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
            {message.userName}
          </div>
        )}
        <p className="text-sm">{message.content}</p>
        <div className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}