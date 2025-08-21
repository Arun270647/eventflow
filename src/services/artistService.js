import { supabase } from '../lib/supabase';

class ArtistService {
  async getArtistProfile(userId) {
    try {
      const { data, error } = await supabase?.from('artist_profiles')?.select(`
          *,
          user_profile:user_profiles(*)
        `)?.eq('user_id', userId)?.single();

      if (error && error?.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch artist profile');
    }
  }

  async createArtistProfile(profileData) {
    try {
      const { data, error } = await supabase?.from('artist_profiles')?.insert([profileData])?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create artist profile');
    }
  }

  async updateArtistProfile(userId, updates) {
    try {
      const { data, error } = await supabase?.from('artist_profiles')?.update(updates)?.eq('user_id', userId)?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update artist profile');
    }
  }

  async getArtistApplications(userId) {
    try {
      const { data, error } = await supabase?.from('artist_applications')?.select(`
          *,
          event:events(
            title,
            event_date,
            venue:venues(name, city)
          )
        `)?.eq('artist_id', userId)?.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch applications');
    }
  }

  async submitApplication(applicationData) {
    try {
      const { data, error } = await supabase?.from('artist_applications')?.insert([applicationData])?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to submit application');
    }
  }

  async updateApplication(id, updates) {
    try {
      const { data, error } = await supabase?.from('artist_applications')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update application');
    }
  }

  async uploadPortfolioFile(userId, file, fileName) {
    try {
      const filePath = `${userId}/portfolio/${fileName}`;
      
      const { error: uploadError } = await supabase?.storage?.from('artist-portfolios')?.upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase?.storage?.from('artist-portfolios')?.getPublicUrl(filePath);

      return data?.publicUrl;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload portfolio file');
    }
  }

  async getPortfolioFiles(userId) {
    try {
      const { data, error } = await supabase?.storage?.from('artist-portfolios')?.list(`${userId}/portfolio`);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to get portfolio files');
    }
  }

  async deletePortfolioFile(userId, fileName) {
    try {
      const filePath = `${userId}/portfolio/${fileName}`;
      
      const { error } = await supabase?.storage?.from('artist-portfolios')?.remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to delete portfolio file');
    }
  }
}

export const artistService = new ArtistService();