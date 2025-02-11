import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useDirectMessages } from '../../../lib/hooks/useDirectMessages';
import { Profile } from '../../../lib/types/profile';

interface DirectMessageProps {
  recipient: Profile;
  seminarId: string;
  onClose: () => void;
}

export default function DirectMessage({ recipient, seminarId, onClose }: DirectMessageProps) {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, isLoading } = useDirectMessages(recipient.id, seminarId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="font-medium">
            Message {recipient.first_name} {recipient.last_name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === recipient.id ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender_id === recipient.id
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}