import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { plans } from '../../lib/config/pricing';

interface SpouseSectionProps {
  selectedPackage: string;
  includeSpouse: boolean;
  onToggleSpouse: (include: boolean) => void;
  spouseData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onSpouseDataChange: (data: Partial<SpouseSectionProps['spouseData']>) => void;
}

export default function SpouseSection({
  selectedPackage,
  includeSpouse,
  onToggleSpouse,
  spouseData,
  onSpouseDataChange
}: SpouseSectionProps) {
  const packageDetails = plans.find(p => p.name === selectedPackage);
  if (!packageDetails) return null;

  // Elite package always includes spouse
  if (packageDetails.spouseIncluded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <Users className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Spouse/Partner is included with the Elite Package at no extra cost
          </span>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Spouse/Partner Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={spouseData.firstName}
                onChange={e => onSpouseDataChange({ firstName: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={spouseData.lastName}
                onChange={e => onSpouseDataChange({ lastName: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={spouseData.email}
              onChange={e => onSpouseDataChange({ email: e.target.value })}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-gray-500" />
          <h4 className="font-medium">Add Spouse/Partner</h4>
        </div>
        <button
          type="button"
          onClick={() => onToggleSpouse(!includeSpouse)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            includeSpouse
              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {includeSpouse ? 'Remove' : 'Add'} (+${packageDetails.spousePrice})
        </button>
      </div>

      {includeSpouse && (
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={spouseData.firstName}
                onChange={e => onSpouseDataChange({ firstName: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={spouseData.lastName}
                onChange={e => onSpouseDataChange({ lastName: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={spouseData.email}
              onChange={e => onSpouseDataChange({ email: e.target.value })}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h5 className="font-medium mb-2">Included for Spouse/Partner:</h5>
            <ul className="space-y-2">
              {packageDetails.spouseFeatures?.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}