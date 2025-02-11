import React from 'react';

interface SeminarFormProps {
  formData: {
    start_date: string;
    end_date: string;
    location: string;
    total_spots: number;
  };
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onChange: (data: Partial<typeof formData>) => void;
}

export default function SeminarForm({ formData, onSubmit, onCancel, onChange }: SeminarFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            required
            value={formData.start_date}
            onChange={(e) => onChange({ start_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            required
            value={formData.end_date}
            onChange={(e) => onChange({ end_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Total Spots</label>
        <input
          type="number"
          required
          min="1"
          value={formData.total_spots}
          onChange={(e) => onChange({ total_spots: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-400 rounded-md"
        >
          Add Seminar
        </button>
      </div>
    </form>
  );
}