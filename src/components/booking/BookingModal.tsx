import React from 'react';
import { X } from 'lucide-react';
import BookingForm from './BookingForm';
import { Package } from './types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: Package;
}

export default function BookingModal({ isOpen, onClose, selectedPackage }: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedPackage ? `Book ${selectedPackage.name}` : 'Secure Your Investment Journey'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <BookingForm onClose={onClose} selectedPackage={selectedPackage} />
          </div>
        </div>
      </div>
    </div>
  );
}