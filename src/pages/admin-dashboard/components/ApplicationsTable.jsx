import React, { useState, useEffect } from 'react';



import { artistService } from '../../../services/artistService';
import { useAuth } from '../../../contexts/AuthContext';

export function ApplicationsTable() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // For admin dashboard, we'd need a different service method
        // Using placeholder data structure for now
        const mockApplications = [
          {
            id: '1',
            event: { title: 'Summer Jazz Festival', venue: { name: 'Music Hall', city: 'Austin' } },
            artist_id: 'artist-1',
            status: 'pending',
            proposed_fee: 500,
            submitted_at: new Date()?.toISOString(),
            cover_letter: 'Looking forward to performing at your festival...'
          }
        ];
        
        if (isMounted) setApplications(mockApplications);
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

  const handleStatusUpdate = async (applicationId, newStatus, adminNotes = '') => {
    try {
      setUpdating(applicationId);
      
      const updates = {
        status: newStatus,
        admin_notes: adminNotes,
        reviewed_at: new Date()?.toISOString(),
        reviewed_by: user?.id
      };

      await artistService?.updateApplication(applicationId, updates);
      
      setApplications(applications?.map(app => 
        app?.id === applicationId 
          ? { ...app, ...updates }
          : app
      ));
    } catch (err) {
      setError(err?.message);
    } finally {
      setUpdating(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Artist Applications</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Please sign in to view applications</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Artist Applications</h2>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Artist Applications</h2>
      </div>
      {error && (
        <div className="px-6 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}
      {applications?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposed Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications?.map((application) => (
                <tr key={application?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application?.event?.title || 'Event Title'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application?.event?.venue?.name || 'Venue'}, {application?.event?.venue?.city || 'City'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Artist ID: {application?.artist_id || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${application?.proposed_fee || '0.00'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      application?.status === 'approved' ?'bg-green-100 text-green-800'
                        : application?.status === 'rejected' ?'bg-red-100 text-red-800' :'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application?.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application?.submitted_at ? 
                      new Date(application.submitted_at)?.toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {application?.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application?.id, 'approved')}
                          disabled={updating === application?.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {updating === application?.id ? 'Updating...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application?.id, 'rejected')}
                          disabled={updating === application?.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}