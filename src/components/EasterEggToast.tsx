import React from 'react';
import { Gift, Sparkles, LightbulbIcon, Copy, X } from 'lucide-react';

interface EasterEggToastProps {
  message: string;
  type: 'bonus' | 'discount' | 'tip';
  code?: string;
  onDismiss: () => void;
}

const icons = {
  bonus: Gift,
  discount: Sparkles,
  tip: LightbulbIcon
};

export default function EasterEggToast({ message, type, code, onDismiss }: EasterEggToastProps) {
  const Icon = icons[type];
  
  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      alert('Discount code copied to clipboard!');
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-yellow-500" />
            <p className="text-gray-800 font-medium">{message}</p>
          </div>
          <button 
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {code && (
          <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded">
            <code className="text-yellow-600 font-mono">{code}</code>
            <button
              onClick={copyCode}
              className="text-gray-600 hover:text-yellow-500 p-1"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}