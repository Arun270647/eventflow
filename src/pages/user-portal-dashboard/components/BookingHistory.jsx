import React, { useState, useEffect } from 'react';



import { bookingService } from '../../../services/bookingService';
import { useAuth } from '../../../contexts/AuthContext';

export function BookingHistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const data = await bookingService?.getUserBookings(user?.id);
        if (isMounted) setBookings(data);
      } catch (err) {
        if (isMounted) setError(err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBookings();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService?.cancelBooking(bookingId);
      setBookings(bookings?.map(booking => 
        booking?.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (err) {
      setError(err?.message);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking History</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Please sign in to view your booking history</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking History</h2>
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
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking History</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {bookings?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found</p>
          <p className="text-sm text-gray-400 mt-2">
            Start exploring events and make your first booking!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings?.map((booking) => (
            <div key={booking?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {booking?.event?.title || 'Event Title'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {booking?.event?.venue?.name || 'Venue'}, {booking?.event?.venue?.city || 'City'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking?.status === 'confirmed' ?'bg-green-100 text-green-800'
                    : booking?.status === 'cancelled' ?'bg-red-100 text-red-800' :'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking?.status?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Event Date:</span>
                  <div>
                    {booking?.event?.event_date ? 
                      new Date(booking.event.event_date)?.toLocaleDateString() : 'TBD'}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Quantity:</span>
                  <div>{booking?.quantity || 0} ticket(s)</div>
                </div>
                <div>
                  <span className="font-medium">Total:</span>
                  <div>${booking?.total_amount || '0.00'}</div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Booking Reference:</span> 
                <span className="ml-2">{booking?.booking_reference || 'N/A'}</span>
              </div>

              {booking?.status === 'confirmed' && (
                <button
                  onClick={() => handleCancelBooking(booking?.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium transition duration-200"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}