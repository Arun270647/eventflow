import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export function AuthForm({ mode, onToggleMode, onForgotPassword }) {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const isSignUp = mode === 'register';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        // Enhanced signup flow with role handling
        const { data, error } = await signUp(formData?.email, formData?.password, {
          full_name: formData?.fullName,
          role: formData?.role
        });
        
        if (error) {
          setError(error);
        } else {
          if (formData?.role === 'artist') {
            // For artists, redirect to application form
            setSuccess('Account created successfully! Please complete your artist application.');
            setTimeout(() => {
              navigate('/artist-application-form');
            }, 2000);
          } else {
            // For regular users, redirect to user dashboard
            setSuccess('Account created successfully! Welcome to EventFlow.');
            setTimeout(() => {
              navigate('/user-portal-dashboard');
            }, 2000);
          }
        }
      } else {
        // Sign in flow with role-based routing
        const { data, error } = await signIn(formData?.email, formData?.password);
        
        if (error) {
          setError(error);
        } else {
          // Get user role and redirect accordingly
          const userRole = data?.user?.user_metadata?.role || 'user';
          
          switch (userRole) {
            case 'admin':
              navigate('/admin-dashboard');
              break;
            case 'artist':
              navigate('/artist-portal-dashboard');
              break;
            case 'user':
            default:
              navigate('/user-portal-dashboard');
              break;
          }
        }
      }
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData?.fullName}
              onChange={handleChange}
              required={isSignUp}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            {!isSignUp && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            )}
          </div>
          <input
            type="password"
            name="password"
            value={formData?.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to join as:
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData?.role === 'user'}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Event Attendee</div>
                  <div className="text-sm text-gray-500">
                    Discover and book tickets for musical events
                  </div>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  checked={formData?.role === 'artist'}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Artist/Performer</div>
                  <div className="text-sm text-gray-500">
                    Apply to perform at events (requires admin approval)
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}