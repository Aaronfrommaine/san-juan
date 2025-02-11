import React, { useState } from 'react';
import { RoomType } from '../../../lib/types/hotels';

interface RoomTypeFormProps {
  hotelId: string;
  initialData?: RoomType;
  onSubmit: (data: Omit<RoomType, 'id'>) => Promise<void>;
  isSubmitting: boolean;
}

const defaultAmenities = {
  size: '',
  bed: 'King',
  view: '',
  terrace: false,
  balcony: false,
  beach_access: false,
  butler_service: false
};

export default function RoomTypeForm({ hotelId, initialData, onSubmit, isSubmitting }: RoomTypeFormProps) {
  const [formData, setFormData] = useState({
    hotel_id: hotelId,
    name: initialData?.name || '',
    description: initialData?.description || '',
    package_level: initialData?.package_level || 'standard',
    amenities: initialData?.amenities || defaultAmenities
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAmenityChange = (amenity: keyof typeof defaultAmenities, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Room Type Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          placeholder="e.g., Ocean View Suite"
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
          rows={3}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          placeholder="Describe the room type and its features..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Package Level
        </label>
        <select
          required
          value={formData.package_level}
          onChange={e => setFormData(prev => ({ ...prev, package_level: e.target.value as RoomType['package_level'] }))}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="standard">Standard</option>
          <option value="vip">VIP</option>
          <option value="elite">Elite</option>
        </select>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Room Details</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Room Size
            </label>
            <input
              type="text"
              value={formData.amenities.size}
              onChange={e => handleAmenityChange('size', e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g., 500 sqft"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bed Type
            </label>
            <select
              value={formData.amenities.bed}
              onChange={e => handleAmenityChange('bed', e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="King">King</option>
              <option value="Queen">Queen</option>
              <option value="Double">Double</option>
              <option value="Twin">Twin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              View
            </label>
            <input
              type="text"
              value={formData.amenities.view}
              onChange={e => handleAmenityChange('view', e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g., Ocean View"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.amenities.terrace}
              onChange={e => handleAmenityChange('terrace', e.target.checked)}
              className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Terrace</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.amenities.balcony}
              onChange={e => handleAmenityChange('balcony', e.target.checked)}
              className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Balcony</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.amenities.beach_access}
              onChange={e => handleAmenityChange('beach_access', e.target.checked)}
              className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Beach Access</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.amenities.butler_service}
              onChange={e => handleAmenityChange('butler_service', e.target.checked)}
              className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Butler Service</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Room Type' : 'Add Room Type'}
        </button>
      </div>
    </form>
  );
}