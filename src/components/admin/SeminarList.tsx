import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Seminar = Database['public']['Tables']['seminars']['Row'];

interface SeminarListProps {
  seminars: Seminar[];
  selectedSeminarId: string | null;
  onSelect: (id: string) => void;
  onEdit: (seminar: Seminar) => void;
  onDelete: (id: string) => void;
}

export default function SeminarList({
  seminars,
  selectedSeminarId,
  onSelect,
  onEdit,
  onDelete
}: SeminarListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dates
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Spots
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {seminars.map((seminar) => (
            <tr 
              key={seminar.id}
              className={selectedSeminarId === seminar.id ? 'bg-yellow-50' : ''}
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
                {seminar.spots_remaining} / {seminar.total_spots}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${seminar.status === 'upcoming' ? 'bg-green-100 text-green-800' : 
                    seminar.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {seminar.status}
                </span>
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