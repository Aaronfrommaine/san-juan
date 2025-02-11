import React from 'react';
import { Calendar, Edit2, Trash2, Users } from 'lucide-react';
import { Database } from '../../../lib/database.types';
import HostAssignments from '../HostAssignments';
import { useSeminars } from '../../../lib/hooks/useSeminars';

type Seminar = Database['public']['Tables']['seminars']['Row'];

interface SeminarListProps {
  selectedSeminarId: string | null;
  onSelect: (id: string) => void;
  onEdit: (seminar: Seminar) => void;
  onDelete: (id: string) => void;
}

export default function SeminarList({
  selectedSeminarId,
  onSelect,
  onEdit,
  onDelete
}: SeminarListProps) {
  const { seminars, isLoading, error } = useSeminars();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-red-600">
        Error loading seminars: {error.message}
      </div>
    );
  }

  if (!seminars.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No seminars found. Add your first seminar to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Dates
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Spots
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Host
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {seminars.map((seminar) => (
            <tr 
              key={seminar.id}
              className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                selectedSeminarId === seminar.id ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
              }`}
              onClick={() => onSelect(seminar.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    {new Date(seminar.start_date).toLocaleDateString()} -
                    {new Date(seminar.end_date).toLocaleDateString()}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{seminar.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{seminar.spots_remaining} / {seminar.total_spots}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${seminar.status === 'upcoming' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                    : seminar.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'}`}>
                  {seminar.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <HostAssignments seminar={seminar} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  className="text-yellow-600 hover:text-yellow-900 mr-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(seminar);
                  }}
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this seminar?')) {
                      onDelete(seminar.id);
                    }
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}