import { supabase } from '../lib/supabase';

class EventService {
  async getEvents(filters = {}) {
    try {
      let query = supabase?.from('events')?.select(`
          *,
          venue:venues(name, address, city),
          event_categories(
            category:categories(name)
          )
        `)?.eq('status', 'published')?.order('event_date', { ascending: true });

      if (filters?.category) {
        query = query?.contains('event_categories.category.name', [filters?.category]);
      }

      if (filters?.city) {
        query = query?.eq('venues.city', filters?.city);
      }

      if (filters?.date_from) {
        query = query?.gte('event_date', filters?.date_from);
      }

      if (filters?.date_to) {
        query = query?.lte('event_date', filters?.date_to);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch events');
    }
  }

  async getEventById(id) {
    try {
      const { data, error } = await supabase?.from('events')?.select(`
          *,
          venue:venues(*),
          event_categories(
            category:categories(*)
          ),
          event_artists(
            artist:artist_profiles(*)
          )
        `)?.eq('id', id)?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch event');
    }
  }

  async createEvent(eventData) {
    try {
      const { data, error } = await supabase?.from('events')?.insert([eventData])?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create event');
    }
  }

  async updateEvent(id, updates) {
    try {
      const { data, error } = await supabase?.from('events')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update event');
    }
  }

  async deleteEvent(id) {
    try {
      const { error } = await supabase?.from('events')?.delete()?.eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to delete event');
    }
  }

  async getUpcomingEvents(limit = 10) {
    try {
      const { data, error } = await supabase?.from('events')?.select(`
          *,
          venue:venues(name, city)
        `)?.eq('status', 'published')?.gte('event_date', new Date()?.toISOString())?.order('event_date', { ascending: true })?.limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch upcoming events');
    }
  }

  async searchEvents(searchTerm) {
    try {
      const { data, error } = await supabase?.from('events')?.select(`
          *,
          venue:venues(name, city)
        `)?.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)?.eq('status', 'published')?.order('event_date', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to search events');
    }
  }
}

export const eventService = new EventService();