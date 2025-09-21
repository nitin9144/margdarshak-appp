
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Define the shape of the user object for our simple auth
export interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check cookie for a saved user session
    try {
      const savedUser = Cookies.get('user-session');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user session from cookie", error);
    }
    setLoading(false);
  }, []);

  const signIn = (user: User) => {
    setUser(user);
    Cookies.set('user-session', JSON.stringify(user), { expires: 7 }); // expires in 7 days
  };

  const signOut = () => {
    setUser(null);
    Cookies.remove('user-session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
