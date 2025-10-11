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
    // Create a mock user object with a valid UUID
    // Using a consistent UUID for all mock users to avoid database issues
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000001',
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

    // Clear all saved form data from localStorage
    localStorage.removeItem('tripFormData');
    localStorage.removeItem('bookingFormData');
    localStorage.removeItem('loginEmail');
    localStorage.removeItem('signupEmail');
    localStorage.removeItem('signupFullName');
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
