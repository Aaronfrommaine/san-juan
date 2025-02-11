import React, { useState } from 'react';
import { Calendar, Plus, ListTodo, Home, Users, Building2, BarChart } from 'lucide-react';
import EditSeminarModal from './EditSeminarModal';
import { useSeminarManagement } from '../../lib/hooks/useSeminarManagement';
import ItineraryManagement from './itinerary/ItineraryManagement';
import SeminarForm from './seminar/SeminarForm';
import SeminarList from './seminar/SeminarList';
import AttendeeManagement from './attendees/AttendeeManagement';
import HotelManagement from './hotels/HotelManagement';
import UserManagement from './users/UserManagement';
import AnalyticsDashboard from './analytics/AnalyticsDashboard';
import { Database } from '../../lib/database.types';

type Seminar = Database['public']['Tables']['seminars']['Row'];

type ViewType = 'seminars' | 'itinerary' | 'attendees' | 'hotels' | 'users' | 'analytics';

export default function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<Seminar | null>(null);
  const [selectedSeminarId, setSelectedSeminarId] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('analytics');
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    location: '',
    total_spots: 20
  });

  const { updateSeminar, deleteSeminar } = useSeminarManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSeminar) {
        await updateSeminar(editingSeminar.id, formData);
      }
      setShowForm(false);
      setEditingSeminar(null);
    } catch (error) {
      console.error('Error saving seminar:', error);
      alert('Failed to save seminar');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>
        {view === 'seminars' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Seminar
          </button>
        )}
      </div>

      <div className="flex space-x-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setView('analytics')}
          className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
            view === 'analytics'
              ? 'bg-yellow-500 text-black'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <BarChart className="h-5 w-5 mr-2" />
          Analytics
        </button>
        <button
          onClick={() => setView('seminars')}
          className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
            view === 'seminars'
              ? 'bg-yellow-500 text-black'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Calendar className="h-5 w-5 mr-2" />
          Seminars
        </button>
        {selectedSeminarId && (
          <button
            onClick={() => setView('itinerary')}
            className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
              view === 'itinerary'
                ? 'bg-yellow-500 text-black'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <ListTodo className="h-5 w-5 mr-2" />
            Itinerary
          </button>
        )}
        <button
          onClick={() => setView('attendees')}
          className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
            view === 'attendees'
              ? 'bg-yellow-500 text-black'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          Attendees
        </button>
        <button
          onClick={() => setView('hotels')}
          className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
            view === 'hotels'
              ? 'bg-yellow-500 text-black'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Building2 className="h-5 w-5 mr-2" />
          Hotels
        </button>
        <button
          onClick={() => setView('users')}
          className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
            view === 'users'
              ? 'bg-yellow-500 text-black'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          Users
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        {view === 'analytics' ? (
          <AnalyticsDashboard />
        ) : view === 'seminars' ? (
          <>
            {showForm && (
              <SeminarForm
                formData={formData}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
                onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
              />
            )}

            <SeminarList
              seminars={[]}
              selectedSeminarId={selectedSeminarId}
              onSelect={setSelectedSeminarId}
              onEdit={setEditingSeminar}
              onDelete={deleteSeminar}
            />
          </>
        ) : view === 'itinerary' ? (
          selectedSeminarId && <ItineraryManagement seminarId={selectedSeminarId} />
        ) : view === 'hotels' ? (
          <HotelManagement />
        ) : view === 'users' ? (
          <UserManagement />
        ) : (
          <AttendeeManagement />
        )}
      </div>

      {editingSeminar && (
        <EditSeminarModal
          seminar={editingSeminar}
          isOpen={true}
          onClose={() => setEditingSeminar(null)}
          onSave={handleSubmit}
        />
      )}
    </div>
  );
}