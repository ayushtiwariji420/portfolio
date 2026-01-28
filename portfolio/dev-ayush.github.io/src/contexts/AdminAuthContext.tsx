'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, LoginCredentials } from '@/types/portfolio';

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin credentials - in production, use proper authentication
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};
const AUTH_KEY = 'admin_auth_token';
const AUTH_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authData = localStorage.getItem(AUTH_KEY);
      if (authData) {
        const { timestamp, authenticated, user } = JSON.parse(authData);
        const now = Date.now();
        
        // Check if authentication is still valid (not expired)
        if (authenticated && user && (now - timestamp) < AUTH_EXPIRY) {
          setState(prev => ({ 
            ...prev, 
            user: user,
            isAuthenticated: true, 
            isLoading: false 
          }));
          return;
        } else {
          // Auth expired, remove from localStorage
          localStorage.removeItem(AUTH_KEY);
        }
      }
      
      setState(prev => ({ ...prev, user: null, isAuthenticated: false, isLoading: false }));
    } catch (error) {
      console.error('Error checking auth status:', error);
      setState(prev => ({ ...prev, user: null, isAuthenticated: false, isLoading: false }));
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (credentials.username === ADMIN_CREDENTIALS.username && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        const user: AdminUser = {
          username: credentials.username,
          role: 'admin'
        };

        const authData = {
          authenticated: true,
          timestamp: Date.now(),
          user: user,
        };
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
        setState(prev => ({ 
          ...prev, 
          user: user,
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        }));
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          user: null,
          isAuthenticated: false, 
          isLoading: false,
          error: 'Invalid username or password' 
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        user: null,
        isAuthenticated: false, 
        isLoading: false,
        error: 'Authentication failed' 
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setState(prev => ({ 
      ...prev, 
      user: null,
      isAuthenticated: false, 
      isLoading: false,
      error: null 
    }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const contextValue: AdminAuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    clearError,
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Admin Login Component
export const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login, isLoading, error, clearError } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(credentials);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter admin credentials to access dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="text-sm text-red-800 dark:text-red-200">
                {error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !credentials.username.trim() || !credentials.password.trim()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Protected Route Component
export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
};
