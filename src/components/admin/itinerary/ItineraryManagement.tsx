import React, { useState } from 'react';
import { useItineraryItems } from '../../../lib/hooks/useItineraryItems';
import { useSeminars } from '../../../lib/hooks/useSeminars';
import ItineraryItemForm from './ItineraryItemForm';
import ItineraryList from './ItineraryList';
import ItineraryHeader from './ItineraryHeader';
import SeminarInfo from './SeminarInfo';
import AttendeeList from './AttendeeList';

interface ItineraryManagementProps {
  seminarId: string;
}

export default function ItineraryManagement({ seminarId }: ItineraryManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const { items, isLoading, error, addItem, updateItem, deleteItem } = useItineraryItems(seminarId);
  const { seminars } = useSeminars();
  const seminar = seminars.find(s => s.id === seminarId);

  if (isLoading) {
    return <div className="p-6">Loading itinerary items...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error.message}</div>;
  }

  if (!seminar) {
    return <div className="p-6">Seminar not found</div>;
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem, data);
      } else {
        await addItem({ ...data, seminar_id: seminarId });
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving itinerary item:', error);
      alert('Failed to save itinerary item');
    }
  };

  return (
    <div className="space-y-6">
      <SeminarInfo seminar={seminar} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ItineraryHeader onAddItem={() => setShowForm(true)} />

          <ItineraryList
            items={items}
            onEdit={setEditingItem}
            onDelete={deleteItem}
          />
        </div>

        <div>
          <AttendeeList seminarId={seminarId} />
        </div>
      </div>

      {(showForm || editingItem) && (
        <ItineraryItemForm
          seminarId={seminarId}
          itemId={editingItem}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}