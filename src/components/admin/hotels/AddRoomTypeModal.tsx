import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RoomType } from '../../../lib/types/hotels';
import RoomTypeForm from './RoomTypeForm';

interface AddRoomTypeModalProps {
  hotelId: string;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (roomType: Omit<RoomType, 'id'>) => Promise<void>;
}

export default function AddRoomTypeModal({ hotelId, isOpen, onClose, onAdd }: AddRoomTypeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<RoomType, 'id'>) => {
    setIsSubmitting(true);
    try {
      await onAdd(data);
      onClose();
    } catch (error) {
      console.error('Failed to add room type:', error);
      alert('Failed to add room type. Please try again.');
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
              Add Room Type
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <RoomTypeForm
              hotelId={hotelId}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}