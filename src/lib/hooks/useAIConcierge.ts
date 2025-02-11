import { useState } from 'react';

interface Message {
  content: string;
  isBot: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    content: "Hello! I'm your AI Investment Concierge. I can help you prepare for your upcoming seminar in Puerto Rico. Ask me anything about travel arrangements, investment preparation, or local tips!",
    isBot: true
  }
];

export function useAIConcierge() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { content, isBot: false }]);

    try {
      // TODO: Integrate with actual AI service
      // For now, simulate a response
      const response = "Thank you for your question. I'm currently in development, but I'll be able to help you with personalized advice soon!";
      
      setTimeout(() => {
        setMessages(prev => [...prev, { content: response, isBot: true }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}