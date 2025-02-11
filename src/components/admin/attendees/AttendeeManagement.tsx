import React, { useState } from 'react';
import { useAttendees } from '../../../lib/hooks/useAttendees';
import { useSeminars } from '../../../lib/hooks/useSeminars';
import AttendeeList from './AttendeeList';
import SeminarSelect from './SeminarSelect';
import AddAttendeeModal from './AddAttendeeModal';
import { Plus } from 'lucide-react';

export default function AttendeeManagement() {
  const { seminars } = useSeminars();
  const [selectedSeminarId, setSelectedSeminarId] = useState<string | null>(null);
  const { attendees, isLoading, refetch } = useAttendees(selectedSeminarId || undefined);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Seminar Attendees</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Attendee
          </button>
        </div>
        <SeminarSelect
          seminars={seminars}
          selectedSeminarId={selectedSeminarId}
          onSelect={setSelectedSeminarId}
        />
      </div>

      {selectedSeminarId && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <AttendeeList 
            attendees={attendees}
            isLoading={isLoading}
          />
        </div>
      )}

      <AddAttendeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          refetch();
          setShowAddModal(false);
        }}
      />
    </div>
  );
}