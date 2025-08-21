import { supabase } from '../lib/supabase';

class AuthService {
  async signUp(email, password, additionalData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: additionalData,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to sign up');
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async getCurrentSession() {
    try {
      const { data, error } = await supabase?.auth?.getSession();
      if (error) {
        throw error;
      }
      return data?.session;
    } catch (error) {
      throw new Error(error.message || 'Failed to get current session');
    }
  }

  async getCurrentUser() {
    try {
      const { data, error } = await supabase?.auth?.getUser();
      if (error) {
        throw error;
      }
      return data?.user;
    } catch (error) {
      throw new Error(error.message || 'Failed to get current user');
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window.location?.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  }

  async updatePassword(newPassword) {
    try {
      const { error } = await supabase?.auth?.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to update password');
    }
  }

  async signInWithOAuth(provider) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location?.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(error.message || `Failed to sign in with ${provider}`);
    }
  }
}

export const authService = new AuthService();