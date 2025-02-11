import React, { useState } from 'react';
import { Hotel } from '../../../lib/types/hotels';

interface HotelFormProps {
  initialData?: Hotel;
  onSubmit: (data: Omit<Hotel, 'id'>) => Promise<void>;
  isSubmitting: boolean;
}

const defaultAmenities = {
  pool: false,
  beach_access: false,
  restaurant: false,
  spa: false,
  fitness_center: false,
  conference_facilities: false,
  rooftop_bar: false,
  art_gallery: false
};

export default function HotelForm({ initialData, onSubmit, isSubmitting }: HotelFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    amenities: initialData?.amenities || defaultAmenities
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAmenityChange = (amenity: keyof typeof defaultAmenities) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Property Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          placeholder="e.g., Oceanview Resort & Spa"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          placeholder="e.g., Rincón, Puerto Rico"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          required
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          placeholder="Describe the property and its unique features..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(defaultAmenities).map(([key, _]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.amenities[key as keyof typeof defaultAmenities]}
                onChange={() => handleAmenityChange(key as keyof typeof defaultAmenities)}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Property' : 'Add Property'}
        </button>
      </div>
    </form>
  );
}