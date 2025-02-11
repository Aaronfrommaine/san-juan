import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useHotels } from '../../../lib/hooks/useHotels';
import { useHotelManagement } from '../../../lib/hooks/useHotelManagement';
import { useRoomTypeManagement } from '../../../lib/hooks/useRoomTypeManagement';
import { Hotel, RoomType } from '../../../lib/types/hotels';
import HotelList from './HotelList';
import RoomList from './RoomList';
import AddHotelModal from './AddHotelModal';
import EditHotelModal from './EditHotelModal';
import AddRoomTypeModal from './AddRoomTypeModal';
import RoomAssignmentList from './RoomAssignmentList';

export default function HotelManagement() {
  const { hotels, roomTypes, rooms, isLoading, error, refetch } = useHotels();
  const { addHotel, updateHotel, deleteHotel } = useHotelManagement();
  const { addRoomType, deleteRoomType } = useRoomTypeManagement();
  
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [showAddRoomType, setShowAddRoomType] = useState(false);

  const handleAddHotel = async (data: Omit<Hotel, 'id'>) => {
    await addHotel(data);
    refetch();
  };

  const handleUpdateHotel = async (id: string, data: Partial<Hotel>) => {
    await updateHotel(id, data);
    refetch();
  };

  const handleDeleteHotel = async (id: string) => {
    await deleteHotel(id);
    if (selectedHotel?.id === id) {
      setSelectedHotel(null);
    }
    refetch();
  };

  const handleAddRoomType = async (data: Omit<RoomType, 'id'>) => {
    await addRoomType(data);
    refetch();
  };

  const handleDeleteRoomType = async (id: string) => {
    await deleteRoomType(id);
    refetch();
  };

  if (isLoading) {
    return <div className="p-6">Loading properties...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading properties: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Properties
          </h2>
          <button
            onClick={() => setShowAddHotel(true)}
            className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </button>
        </div>

        <HotelList
          hotels={hotels}
          selectedHotel={selectedHotel}
          onSelect={setSelectedHotel}
          onEdit={setEditingHotel}
          onDelete={handleDeleteHotel}
        />
      </div>

      {selectedHotel && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Room Types
              </h3>
              <button
                onClick={() => setShowAddRoomType(true)}
                className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Room Type
              </button>
            </div>

            <RoomList
              hotelId={selectedHotel.id}
              rooms={rooms.filter(room => room.hotel_id === selectedHotel.id)}
              roomTypes={roomTypes.filter(rt => rt.hotel_id === selectedHotel.id)}
              onEditRoomType={() => {}}
              onDeleteRoomType={handleDeleteRoomType}
              onUpdateRooms={refetch}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Room Assignments
            </h3>
            <RoomAssignmentList hotelId={selectedHotel.id} />
          </div>
        </>
      )}

      {showAddHotel && (
        <AddHotelModal
          isOpen={true}
          onClose={() => setShowAddHotel(false)}
          onAdd={handleAddHotel}
        />
      )}

      {editingHotel && (
        <EditHotelModal
          hotel={editingHotel}
          isOpen={true}
          onClose={() => setEditingHotel(null)}
          onUpdate={handleUpdateHotel}
        />
      )}

      {showAddRoomType && selectedHotel && (
        <AddRoomTypeModal
          hotelId={selectedHotel.id}
          isOpen={true}
          onClose={() => setShowAddRoomType(false)}
          onAdd={handleAddRoomType}
        />
      )}
    </div>
  );
}