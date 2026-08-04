import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { getProfile, createProfile } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(session);
        if (session?.user) {
          const loadedProfile = await getProfile(session.user.id);
          if (mounted) {
            setUser(loadedProfile || { id: session.user.id, email: session.user.email });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSession();

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setSession(session);
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          setUser(profile || { id: session.user.id, email: session.user.email });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email, password, metadata = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
      if (error) throw error;
      if (data?.user) {
        await createProfile(data.user.id, { email, ...metadata });
      }
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      error,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user?.role === "admin"),
      signIn,
      signUp,
      signOut,
    }),
    [user, session, loading, error, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export { AuthContext };
