import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // { id, email, full_name, role }
  const [loading, setLoading] = useState(true);

  // Fetch user profile from user_profiles
  const fetchUserProfile = useCallback(async (uid) => {
    if (!uid) return null;
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role, created_at")
      .eq("id", uid)
      .single();

    if (error) {
      console.error("fetchUserProfile error:", error.message);
      return null;
    }
    return data;
  }, []);

  // Ensure a row exists in user_profiles for the authenticated user
  const ensureProfileRow = useCallback(async (authUser) => {
    if (!authUser) return null;
    const existing = await fetchUserProfile(authUser.id);
    if (existing) return existing;

    const insertPayload = {
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.user_metadata?.full_name || "",
      role: 2, // default normal user
    };

    const { data, error } = await supabase
      .from("user_profiles")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("ensureProfileRow insert error:", error.message);
      return null;
    }
    return data;
  }, [fetchUserProfile]);

  // Init + auth state changes
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const prof = await ensureProfileRow(session.user);
        setProfile(prof);
      }

      setLoading(false);
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);

      if (sess?.user) {
        const prof = await ensureProfileRow(sess.user);
        setProfile(prof);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [ensureProfileRow]);

  // Auth actions
  const signUp = async ({ email, password, full_name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });
    if (error) throw error;

    // ensure profile (may require email confirmation depending on your auth settings)
    if (data?.user) {
      const prof = await ensureProfileRow(data.user);
      setProfile(prof);
    }
    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (data?.user) {
      const prof = await ensureProfileRow(data.user);
      setProfile(prof);
    }
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const value = {
    session,
    user,
    profile,        // includes role (0 admin, 1 artist, 2 user)
    role: profile?.role ?? null,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: async () => {
      if (!user) return;
      const prof = await fetchUserProfile(user.id);
      setProfile(prof);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
