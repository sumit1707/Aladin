import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isSigningUpRef = useRef(false);

  useEffect(() => {
    // Bypass authentication - no session check needed
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Bypass authentication - accept any credentials
    // Create a mock user object
    const mockUser = {
      id: 'mock-user-' + Date.now(),
      email: email,
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    setUser(mockUser);
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Bypass authentication - accept any credentials
    // Just acknowledge the signup without actually creating an account
    isSigningUpRef.current = true;
    try {
      // Do nothing - no actual signup
    } finally {
      isSigningUpRef.current = false;
    }
  };

  const signOut = async () => {
    // Bypass authentication - just clear the mock user
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
