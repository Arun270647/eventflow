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

  // NEW METHOD: Submit artist application for admin review
  async submitArtistApplication(formData, userId) {
    try {
      // First, create the artist application record in artist_applications table
      const applicationData = {
        artist_id: userId,
        event_id: null, // This is a general artist application, not for a specific event
        status: 'pending',
        cover_letter: formData.bio || '',
        portfolio_attachments: JSON.stringify({
          portfolioLinks: formData.portfolioLinks || [],
          uploadedFiles: formData.uploadedFiles || []
        }),
        // Store all form data as JSON in admin_notes for now (will be moved to artist_profiles upon approval)
        admin_notes: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          stageName: formData.stageName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          dateOfBirth: formData.dateOfBirth,
          primaryGenre: formData.primaryGenre,
          primaryInstrument: formData.primaryInstrument,
          experienceLevel: formData.experienceLevel,
          performanceType: formData.performanceType,
          yearsOfExperience: formData.yearsOfExperience,
          performanceExperience: formData.performanceExperience,
          portfolioLinks: formData.portfolioLinks,
          bio: formData.bio,
          artistStatement: formData.artistStatement,
          uploadedFiles: formData.uploadedFiles
        }),
        submitted_at: new Date().toISOString()
      };

      const { data, error } = await supabase?.from('artist_applications')?.insert([applicationData])?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to submit artist application');
    }
  }

  // Get all pending artist applications for admin dashboard
  async getPendingApplications() {
    try {
      const { data, error } = await supabase
        ?.from('artist_applications')
        ?.select(`
          *,
          artist:user_profiles(full_name, email)
        `)
        ?.eq('event_id', null) // Only general artist applications
        ?.order('submitted_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch pending applications');
    }
  }

  // Approve artist application and create artist profile
  async approveArtistApplication(applicationId, adminId) {
    try {
      // Get the application data
      const { data: application, error: fetchError } = await supabase
        ?.from('artist_applications')
        ?.select('*')
        ?.eq('id', applicationId)
        ?.single();

      if (fetchError) {
        throw fetchError;
      }

      if (!application) {
        throw new Error('Application not found');
      }

      // Parse the stored form data
      const formData = JSON.parse(application.admin_notes || '{}');

      // Create artist profile record
      const artistProfileData = {
        user_id: application.artist_id,
        stage_name: formData.stageName,
        bio: formData.bio,
        genres: formData.primaryGenre ? [formData.primaryGenre.toLowerCase()] : [],
        experience_years: parseInt(formData.yearsOfExperience) || 0,
        portfolio_links: JSON.stringify(formData.portfolioLinks || []),
        social_media: JSON.stringify({}),
        is_verified: true,
        rating: 0.0,
        total_reviews: 0
      };

      const { data: artistProfile, error: profileError } = await supabase
        ?.from('artist_profiles')
        ?.insert([artistProfileData])
        ?.select()
        ?.single();

      if (profileError) {
        throw profileError;
      }

      // Update application status
      const { error: updateError } = await supabase
        ?.from('artist_applications')
        ?.update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId
        })
        ?.eq('id', applicationId);

      if (updateError) {
        throw updateError;
      }

      return { application, artistProfile, formData };
    } catch (error) {
      throw new Error(error.message || 'Failed to approve artist application');
    }
  }

  // Reject artist application
  async rejectArtistApplication(applicationId, adminId, reason = '') {
    try {
      const { data, error } = await supabase
        ?.from('artist_applications')
        ?.update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId,
          admin_notes: reason
        })
        ?.eq('id', applicationId)
        ?.select()
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to reject artist application');
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