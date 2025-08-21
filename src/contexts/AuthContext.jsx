import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session?.user?.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase?.auth?.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session?.user?.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

      if (error && error?.code !== 'PGRST116') {
        console.log('Error fetching profile:', error?.message);
        return;
      }

      setProfile(data || null);
    } catch (error) {
      console.log('Profile fetch error:', error?.message);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        return { error: error?.message };
      }
      
      return { data };
    } catch (error) {
      return { error: error?.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error?.message };
      }
      
      return { data };
    } catch (error) {
      return { error: error?.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        return { error: error?.message };
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      return { success: true };
    } catch (error) {
      return { error: error?.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) return { error: 'No user logged in' };
      
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single();

      if (error) {
        return { error: error?.message };
      }

      setProfile(data);
      return { data };
    } catch (error) {
      return { error: error?.message };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};