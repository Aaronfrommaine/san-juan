import React, { useState, useEffect } from 'react';
import { Users, Shield, Star, Wrench, Building2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import UserList from './UserList';
import UserRoleModal from './UserRoleModal';

type UserRole = 'admin' | 'host' | 'attendee' | 'interested' | 'vendor' | 'service_provider';

interface User {
  id: string;
  email: string;
  roles: UserRole[];
  first_name: string;
  last_name: string;
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_roles');

      if (error) throw error;

      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRoles = async (userId: string, newRoles: UserRole[]) => {
    try {
      const { error } = await supabase.rpc('manage_user_roles', {
        target_user_id: userId,
        new_roles: newRoles
      });

      if (error) throw error;

      // Refresh the user list
      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating roles:', err);
      throw err;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'host':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'vendor':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'service_provider':
        return <Building2 className="h-4 w-4 text-green-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserList
        users={users}
        getRoleIcon={getRoleIcon}
        onEditRoles={setEditingUser}
      />

      {editingUser && (
        <UserRoleModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdateRoles={handleUpdateRoles}
        />
      )}
    </div>
  );
}