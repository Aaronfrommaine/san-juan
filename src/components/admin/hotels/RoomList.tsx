import React, { useState } from 'react';
import { Home, Tag, Edit2, Trash2, Plus } from 'lucide-react';
import { Room, RoomType } from '../../../lib/types/hotels';
import RoomInventoryModal from './RoomInventoryModal';

interface RoomListProps {
  hotelId: string;
  rooms: Room[];
  roomTypes: RoomType[];
  onEditRoomType: (roomType: RoomType) => void;
  onDeleteRoomType: (id: string) => void;
  onUpdateRooms: () => void;
}

export default function RoomList({ 
  hotelId,
  rooms, 
  roomTypes,
  onEditRoomType,
  onDeleteRoomType,
  onUpdateRooms
}: RoomListProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);

  const getRoomCount = (roomTypeId: string) => {
    return rooms.filter(room => room.room_type_id === roomTypeId).length;
  };

  const getAvailableRoomCount = (roomTypeId: string) => {
    return rooms.filter(room => 
      room.room_type_id === roomTypeId && 
      room.status === 'available'
    ).length;
  };

  if (!roomTypes.length) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-400">
        No room types added yet. Add a room type to get started.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {roomTypes.map((roomType) => (
        <div
          key={roomType.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Home className="h-5 w-5 text-yellow-500" />
                {roomType.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {roomType.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRoomType(roomType)}
                className="px-3 py-1 text-sm bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEditRoomType(roomType)}
                className="p-1 text-gray-600 hover:text-yellow-500 dark:text-gray-400"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteRoomType(roomType.id)}
                className="p-1 text-gray-600 hover:text-red-500 dark:text-gray-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full capitalize">
              {roomType.package_level} Package
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getAvailableRoomCount(roomType.id)} of {getRoomCount(roomType.id)} rooms available
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(roomType.amenities).map(([key, value]) => (
              typeof value === 'boolean' && value && (
                <span
                  key={key}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              )
            ))}
          </div>
        </div>
      ))}

      {selectedRoomType && (
        <RoomInventoryModal
          hotelId={hotelId}
          roomType={selectedRoomType}
          existingRooms={rooms}
          isOpen={true}
          onClose={() => setSelectedRoomType(null)}
          onUpdate={onUpdateRooms}
        />
      )}
    </div>
  );
}