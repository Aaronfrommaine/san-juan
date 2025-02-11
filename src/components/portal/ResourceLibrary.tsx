import React from 'react';
import { FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const resources = [
  {
    id: 1,
    title: 'Due Diligence Checklist',
    description: 'Comprehensive checklist for evaluating Puerto Rico real estate investments',
    type: 'HTML',
    action: 'checklist'
  },
  {
    id: 2,
    title: 'Tax Benefits Guide',
    description: 'Detailed guide to Puerto Rico tax incentives and Act 60',
    type: 'HTML',
    action: 'tax-guide'
  },
  {
    id: 3,
    title: 'Investment Calculator',
    description: 'ROI and cash flow projection calculator',
    type: 'CALC',
    action: 'calculator'
  }
];

export default function ResourceLibrary() {
  const navigate = useNavigate();

  const handleResourceClick = (resource: typeof resources[0]) => {
    switch (resource.action) {
      case 'checklist':
        navigate('/resources/checklist');
        break;
      case 'tax-guide':
        navigate('/resources/tax-guide');
        break;
      case 'calculator':
        navigate('/resources/calculator');
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Downloadable Resources</h2>
      
      <div className="space-y-4">
        {resources.map((resource) => (
          <div 
            key={resource.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded">
                <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{resource.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
                <div className="flex space-x-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{resource.type}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleResourceClick(resource)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Download className="h-4 w-4 mr-2" />
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}