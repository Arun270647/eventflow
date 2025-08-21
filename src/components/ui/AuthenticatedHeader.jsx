import React, { useState, useEffect } from 'react';



import { useAuth } from '../../contexts/AuthContext';

export function AuthenticatedHeader({ user = null }) {
  const { user: authUser, signOut, profile } = useAuth();
  const currentUser = user || authUser;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">EventFlow</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {profile?.full_name || currentUser?.email}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {profile?.role || 'user'}
                  </div>
                </div>
                {profile?.avatar_url && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={profile?.avatar_url}
                    alt="User avatar"
                  />
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}