import React from 'react';
import { Message } from '../../../lib/types/messaging';

interface MessageBubbleProps {
  message: Message & {
    sender?: {
      first_name: string;
      last_name: string;
      avatar_url?: string;
    };
  };
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const getInitials = () => {
    if (!message.sender) return '?';
    return `${message.sender.first_name[0]}${message.sender.last_name[0]}`.toUpperCase();
  };

  return (
    <div className={`flex items-start gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {message.sender?.avatar_url ? (
          <img
            src={message.sender.avatar_url}
            alt={`${message.sender.first_name} ${message.sender.last_name}`}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-sm font-medium">
            {getInitials()}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`max-w-[70%] ${
        isOwnMessage 
          ? 'bg-yellow-500 text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
      } rounded-lg p-3`}>
        {!isOwnMessage && message.sender && (
          <div className="text-sm font-medium mb-1">
            {message.sender.first_name} {message.sender.last_name}
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className="text-xs mt-1 opacity-70">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}