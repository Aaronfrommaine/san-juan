import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { useAIConcierge } from '../../../lib/hooks/useAIConcierge';
import { useLanguage } from '../../../lib/context/LanguageContext';

export default function AIConcierge() {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, isLoading } = useAIConcierge();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.isBot
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'bg-yellow-500 text-white'
              }`}
            >
              {msg.isBot && (
                <div className="flex items-center mb-2">
                  <Bot className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">AI Assistant</span>
                </div>
              )}
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('portal.preArrival.concierge.placeholder')}
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}