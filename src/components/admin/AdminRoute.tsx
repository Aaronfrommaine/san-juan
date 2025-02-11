import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import AdminDashboard from './AdminDashboard';

// List of admin email addresses
const ADMIN_EMAILS = ['aaron@abodekport.com'];

export default function AdminRoute() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }



  return <AdminDashboard />;
}