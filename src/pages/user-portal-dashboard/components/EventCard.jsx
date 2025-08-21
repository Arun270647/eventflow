import React, { useState, useEffect } from 'react';



import { eventService } from '../../../services/eventService';
import { bookingService } from '../../../services/bookingService';
import { useAuth } from '../../../contexts/AuthContext';

export function EventCard({ eventId, showDetails = true }) {
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      try {
        if (eventId) {
          const data = await eventService?.getEventById(eventId);
          if (isMounted) setEvent(data);
        }
      } catch (err) {
        if (isMounted) setError(err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEvent();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleBookEvent = async () => {
    if (!user) {
      setError('Please sign in to book events');
      return;
    }

    try {
      setBooking(true);
      setError('');

      const bookingData = {
        event_id: event?.id,
        user_id: user?.id,
        quantity: 1,
        total_amount: event?.ticket_price || 0,
        status: 'pending'
      };

      await bookingService?.createBooking(bookingData);
      setError('');
      alert('Event booked successfully!');
    } catch (err) {
      setError(err?.message || 'Failed to book event');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-gray-500">Event not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      {event?.image_url && (
        <img
          src={event?.image_url}
          alt={event?.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {event?.title || 'Untitled Event'}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {event?.description || 'No description available'}
        </p>

        {showDetails && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Date:</span>
              <span className="ml-2">
                {event?.event_date ? 
                  new Date(event.event_date)?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'TBD'
                }
              </span>
            </div>
            
            {event?.venue && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Venue:</span>
                <span className="ml-2">
                  {event?.venue?.name}, {event?.venue?.city}
                </span>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Price:</span>
              <span className="ml-2">
                {event?.is_free ? 'Free' : `$${event?.ticket_price || 0}`}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleBookEvent}
          disabled={booking}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {booking ? 'Booking...' : (event?.is_free ? 'Register Free' : 'Book Tickets')}
        </button>
      </div>
    </div>
  );
}