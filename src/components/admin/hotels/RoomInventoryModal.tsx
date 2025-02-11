import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Room, RoomType } from '../../../lib/types/hotels';
import { useRoomManagement } from '../../../lib/hooks/useRoomManagement';

interface RoomInventoryModalProps {
  hotelId: string;
  roomType: RoomType;
  existingRooms: Room[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function RoomInventoryModal({
  hotelId,
  roomType,
  existingRooms,
  isOpen,
  onClose,
  onUpdate
}: RoomInventoryModalProps) {
  const { addRoom, deleteRoom } = useRoomManagement();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newFloor, setNewFloor] = useState('');

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addRoom({
        hotel_id: hotelId,
        room_type_id: roomType.id,
        room_number: newRoomNumber,
        floor: newFloor,
        status: 'available'
      });
      setNewRoomNumber('');
      setNewFloor('');
      onUpdate();
    } catch (error) {
      console.error('Failed to add room:', error);
      alert('Failed to add room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      await deleteRoom(roomId);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete room:', error);
      alert('Failed to delete room. Please try again.');
    }
  };

  if (!isOpen) return null;

  const filteredRooms = existingRooms.filter(room => room.room_type_id === roomType.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage {roomType.name} Rooms
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleAddRoom} className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoomNumber}
                    onChange={e => setNewRoomNumber(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="e.g., 101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    required
                    value={newFloor}
                    onChange={e => setNewFloor(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="e.g., 1"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Room
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Existing Rooms ({filteredRooms.length})
              </h3>
              {filteredRooms.map(room => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">Room {room.room_number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Floor {room.floor}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      room.status === 'available'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : room.status === 'occupied'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {room.status}
                    </span>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}