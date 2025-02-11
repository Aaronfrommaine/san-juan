import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Seminar = Database['public']['Tables']['seminars']['Row'];

interface EditSeminarModalProps {
  seminar: Seminar;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSeminar: Partial<Seminar>) => Promise<void>;
}

export default function EditSeminarModal({ seminar, isOpen, onClose, onSave }: EditSeminarModalProps) {
  const [formData, setFormData] = useState({
    start_date: seminar.start_date,
    end_date: seminar.end_date,
    location: seminar.location,
    total_spots: seminar.total_spots,
    spots_remaining: seminar.spots_remaining
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        throw new Error('End date cannot be before start date');
      }
      if (formData.spots_remaining > formData.total_spots) {
        throw new Error('Spots remaining cannot exceed total spots');
      }
      if (formData.total_spots < 1) {
        throw new Error('Total spots must be at least 1');
      }

      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to update seminar:', err);
      setError(err instanceof Error ? err.message : 'Failed to update seminar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Edit Seminar</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Spots</label>
              <input
                type="number"
                required
                min="1"
                value={formData.total_spots}
                onChange={(e) => setFormData(prev => ({ ...prev, total_spots: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Spots Remaining</label>
              <input
                type="number"
                required
                min="0"
                max={formData.total_spots}
                value={formData.spots_remaining}
                onChange={(e) => setFormData(prev => ({ ...prev, spots_remaining: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-400 rounded-md disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}