import React from 'react';

import { artistService } from '../../../services/artistService';
import { useAuth } from '../../../contexts/AuthContext';
import { useState, useEffect } from 'react';

export function ApplicationStatusCard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const data = await artistService?.getArtistApplications(user?.id);
        if (isMounted) setApplications(data);
      } catch (err) {
        if (isMounted) setError(err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApplications();
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Please sign in to view your applications</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)]?.map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Status</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {applications?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No applications found</p>
          <p className="text-sm text-gray-400 mt-2">
            Start applying to events to see your applications here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications?.map((application) => (
            <div key={application?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {application?.event?.title || 'Event Title'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {application?.event?.venue?.name || 'Venue'}, {application?.event?.venue?.city || 'City'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  application?.status === 'approved' ?'bg-green-100 text-green-800'
                    : application?.status === 'rejected' ?'bg-red-100 text-red-800'
                    : application?.status === 'withdrawn' ?'bg-gray-100 text-gray-800' :'bg-yellow-100 text-yellow-800'
                }`}>
                  {application?.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Event Date:</span>
                  <div>
                    {application?.event?.event_date ? 
                      new Date(application.event.event_date)?.toLocaleDateString() : 'TBD'}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Proposed Fee:</span>
                  <div>${application?.proposed_fee || '0.00'}</div>
                </div>
                <div>
                  <span className="font-medium">Applied:</span>
                  <div>
                    {application?.submitted_at ? 
                      new Date(application.submitted_at)?.toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              {application?.cover_letter && (
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Cover Letter:</span>
                  <p className="mt-1 line-clamp-2">{application?.cover_letter}</p>
                </div>
              )}

              {application?.admin_notes && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
                  <span className="font-medium text-blue-800">Admin Notes:</span>
                  <p className="text-blue-700 mt-1">{application?.admin_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}