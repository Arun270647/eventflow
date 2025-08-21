import { supabase } from '../lib/supabase';

class BookingService {
  async getUserBookings(userId) {
    try {
      const { data, error } = await supabase?.from('bookings')?.select(`
          *,
          event:events(
            title,
            event_date,
            venue:venues(name, city)
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch bookings');
    }
  }

  async createBooking(bookingData) {
    try {
      const { data, error } = await supabase?.from('bookings')?.insert([bookingData])?.select(`
          *,
          event:events(
            title,
            event_date,
            venue:venues(name, city)
          )
        `)?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create booking');
    }
  }

  async updateBooking(id, updates) {
    try {
      const { data, error } = await supabase?.from('bookings')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update booking');
    }
  }

  async cancelBooking(id) {
    try {
      const { data, error } = await supabase?.from('bookings')?.update({ status: 'cancelled' })?.eq('id', id)?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to cancel booking');
    }
  }

  async getBookingById(id) {
    try {
      const { data, error } = await supabase?.from('bookings')?.select(`
          *,
          event:events(
            title,
            event_date,
            ticket_price,
            venue:venues(name, address, city)
          ),
          user:user_profiles(full_name, email)
        `)?.eq('id', id)?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch booking');
    }
  }

  async getEventBookings(eventId) {
    try {
      const { data, error } = await supabase?.from('bookings')?.select(`
          *,
          user:user_profiles(full_name, email)
        `)?.eq('event_id', eventId)?.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch event bookings');
    }
  }

  async checkAvailability(eventId) {
    try {
      const { data: event, error: eventError } = await supabase?.from('events')?.select('max_capacity')?.eq('id', eventId)?.single();

      if (eventError) {
        throw eventError;
      }

      const { count, error: countError } = await supabase?.from('bookings')?.select('*', { count: 'exact', head: true })?.eq('event_id', eventId)?.in('status', ['confirmed', 'pending']);

      if (countError) {
        throw countError;
      }

      return {
        available: count < event?.max_capacity,
        remaining: event?.max_capacity - count
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to check availability');
    }
  }
}

export const bookingService = new BookingService();