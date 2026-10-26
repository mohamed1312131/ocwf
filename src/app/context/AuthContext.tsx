import { createContext, useContext, useState, ReactNode } from 'react';
import { authAPI } from '../../services/api';

interface AuthUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStoredAdmin(): AuthUser | null {
  const token = localStorage.getItem('omnicare_token');
  const storedUser = localStorage.getItem('omnicare_user');

  if (!token || !storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser) as AuthUser;
    return parsedUser.role === 'ADMIN' ? parsedUser : null;
  } catch {
    localStorage.removeItem('omnicare_token');
    localStorage.removeItem('omnicare_user');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredAdmin);
  const isAuthenticated = user !== null;

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email: username, password });
      if (response.role !== 'ADMIN') {
        localStorage.removeItem('omnicare_token');
        localStorage.removeItem('omnicare_user');
        return false;
      }

      const authenticatedUser: AuthUser = {
        userId: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
      };

      localStorage.setItem('omnicare_token', response.token);
      localStorage.setItem('omnicare_user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('omnicare_token');
    localStorage.removeItem('omnicare_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
