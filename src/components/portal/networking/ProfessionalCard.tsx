import React from 'react';
import { Mail, Phone, Globe, Award } from 'lucide-react';
import { Professional } from '../../../lib/types/professionals';

interface ProfessionalCardProps {
  professional: Professional;
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-4">
        <img
          src={professional.image}
          alt={professional.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">{professional.name}</h3>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">{professional.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{professional.company}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{professional.description}</p>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {professional.specialties.map((specialty, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300"
            >
              <Award className="h-3 w-3 mr-1" />
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <a
          href={`mailto:${professional.email}`}
          className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
        >
          <Mail className="h-4 w-4 mr-2" />
          {professional.email}
        </a>
        <a
          href={`tel:${professional.phone}`}
          className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
        >
          <Phone className="h-4 w-4 mr-2" />
          {professional.phone}
        </a>
        {professional.website && (
          <a
            href={professional.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
          >
            <Globe className="h-4 w-4 mr-2" />
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
}