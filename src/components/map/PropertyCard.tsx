import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Property, Attraction } from './types';

interface PropertyCardProps {
  item: Property | Attraction;
  onClose: () => void;
}

export default function PropertyCard({ item, onClose }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">{item.description}</p>
        
        {'price' in item && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-yellow-500">${item.price.toLocaleString()}</span>
            {item.type === 'property' && (
              <span className="text-gray-500 text-sm ml-2">Investment Property</span>
            )}
          </div>
        )}
        
        {'features' in item && (
          <ul className="mb-4 space-y-2">
            {item.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        
        {'website' in item && (
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-yellow-500 hover:text-yellow-600"
          >
            Visit Website
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        )}
        
        {'price' in item && item.featured && (
          <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded transition-colors">
            Schedule Private Tour
          </button>
        )}
      </div>
    </div>
  );
}