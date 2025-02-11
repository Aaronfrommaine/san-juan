import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ItineraryItem, PackageType } from '../../../lib/types/itinerary';
import LocationPicker from './LocationPicker';
import PackageTypeSelect from './PackageTypeSelect';
import { useItineraryItems } from '../../../lib/hooks/useItineraryItems';

interface ItineraryItemFormProps {
  seminarId: string;
  itemId?: string | null;
  onSubmit: (data: Partial<ItineraryItem>) => Promise<void>;
  onClose: () => void;
}

export default function ItineraryItemForm({ seminarId, itemId, onSubmit, onClose }: ItineraryItemFormProps) {
  const { items } = useItineraryItems(seminarId);
  const [formData, setFormData] = useState<Partial<ItineraryItem>>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    day_number: 1,
    location: '',
    activity_type: 'presentation',
    package_type: 'standard',
    speaker_name: '',
    speaker_bio: '',
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  useEffect(() => {
    if (itemId) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        setFormData(item);
        if (item.location.includes('|')) {
          const [address, coords] = item.location.split('|');
          const [lat, lng] = coords.split(',').map(Number);
          setSelectedLocation({
            address,
            coordinates: { lat, lng }
          });
        }
      }
    }
  }, [itemId, items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      day_number: Number(formData.day_number) || 1,
      location: selectedLocation 
        ? `${selectedLocation.address}|${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}`
        : formData.location
    };

    await onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">
            {itemId ? 'Edit Itinerary Item' : 'Add Itinerary Item'}
          </h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Activity Type</label>
              <select
                required
                value={formData.activity_type}
                onChange={e => setFormData(prev => ({ ...prev, activity_type: e.target.value as ItineraryItem['activity_type'] }))}
                className="w-full rounded-lg border-gray-300"
              >
                <option value="presentation">Presentation</option>
                <option value="workshop">Workshop</option>
                <option value="meal">Meal</option>
                <option value="tour">Tour</option>
                <option value="networking">Networking</option>
              </select>
            </div>
          </div>

          <PackageTypeSelect
            value={formData.package_type as PackageType}
            onChange={value => setFormData(prev => ({ ...prev, package_type: value }))}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border-gray-300"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Day Number</label>
              <input
                type="number"
                required
                min="1"
                value={formData.day_number || 1}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  day_number: Math.max(1, parseInt(e.target.value) || 1)
                }))}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={e => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.end_time}
                onChange={e => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <LocationPicker
              onSelect={setSelectedLocation}
              initialLocation={formData.location}
            />
          </div>

          {(formData.activity_type === 'presentation' || formData.activity_type === 'workshop') && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Speaker Name</label>
                <input
                  type="text"
                  value={formData.speaker_name || ''}
                  onChange={e => setFormData(prev => ({ ...prev, speaker_name: e.target.value }))}
                  className="w-full rounded-lg border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Speaker Bio</label>
                <textarea
                  value={formData.speaker_bio || ''}
                  onChange={e => setFormData(prev => ({ ...prev, speaker_bio: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border-gray-300"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
            >
              {itemId ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}