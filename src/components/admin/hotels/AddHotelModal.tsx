import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Hotel } from '../../../lib/types/hotels';
import HotelForm from './HotelForm';

interface AddHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (hotel: Omit<Hotel, 'id'>) => Promise<void>;
}

export default function AddHotelModal({ isOpen, onClose, onAdd }: AddHotelModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Hotel, 'id'>) => {
    setIsSubmitting(true);
    try {
      await onAdd(data);
      onClose();
    } catch (error) {
      console.error('Failed to add hotel:', error);
      alert('Failed to add hotel. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Property
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <HotelForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
}