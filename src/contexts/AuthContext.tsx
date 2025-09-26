import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE } from '../utils/api';
import { trackLogin, trackSignup, setAnalyticsUser, clearAnalyticsUser } from '../utils/analytics';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  favoriteProducts: string[];
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateFavorites: (productId: string, action: 'add' | 'remove') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Set user for analytics tracking on token refresh
        setAnalyticsUser({ id: data.user.id, email: data.user.email });
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('authToken');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      
      // Set user for analytics tracking
      setAnalyticsUser({ id: data.user.id, email: data.user.email });
      
      // Track successful login
      trackLogin({
        userType: data.user.isAdmin ? 'admin' : 'customer'
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) {
        let errorMessage = 'Signup failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      
      // Set user for analytics tracking
      setAnalyticsUser({ id: data.user.id, email: data.user.email });
      
      // Track successful signup
      trackSignup({
        userType: 'customer'
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    clearAnalyticsUser();
  };

  const updateFavorites = async (productId: string, action: 'add' | 'remove') => {
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/user/favorites`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, action }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        throw new Error(data.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    signup,
    logout,
    updateFavorites,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};