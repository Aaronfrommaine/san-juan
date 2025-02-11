import React, { useState } from 'react';
import { X, Shield, Star, Wrench, Building2, Users } from 'lucide-react';

type UserRole = 'admin' | 'host' | 'attendee' | 'interested' | 'vendor' | 'service_provider';

interface User {
  id: string;
  email: string;
  roles: UserRole[];
  first_name: string;
  last_name: string;
}

interface UserRoleModalProps {
  user: User;
  onClose: () => void;
  onUpdateRoles: (userId: string, roles: UserRole[]) => Promise<void>;
}

const AVAILABLE_ROLES: { value: UserRole; label: string; icon: typeof Shield }[] = [
  { value: 'admin', label: 'Administrator', icon: Shield },
  { value: 'host', label: 'Host', icon: Star },
  { value: 'attendee', label: 'Attendee', icon: Users },
  { value: 'interested', label: 'Interested', icon: Users },
  { value: 'vendor', label: 'Vendor', icon: Wrench },
  { value: 'service_provider', label: 'Service Provider', icon: Building2 }
];

export default function UserRoleModal({ user, onClose, onUpdateRoles }: UserRoleModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(user.roles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onUpdateRoles(user.id, selectedRoles);
      onClose();
    } catch (err) {
      console.error('Error updating roles:', err);
      setError(err instanceof Error ? err.message : 'Failed to update roles');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage User Roles
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {AVAILABLE_ROLES.map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRoles.includes(value)
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(value)}
                    onChange={() => toggleRole(value)}
                    className="sr-only"
                  />
                  <Icon className={`h-5 w-5 mr-3 ${
                    selectedRoles.includes(value)
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                  }`} />
                  <span className={`flex-1 ${
                    selectedRoles.includes(value)
                      ? 'text-yellow-900 dark:text-yellow-200'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}