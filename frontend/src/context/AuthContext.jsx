/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = '/api/auth';

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Error loading admin user:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      } else {
        setError(data.msg || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login API error:', err);
      setError('Connection to server failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithGoogle = async (googleCredential, isMock = false, mockEmail = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: googleCredential, isMock, mockEmail })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      } else {
        setError(data.msg || 'Google login failed');
        return false;
      }
    } catch (err) {
      console.error('Google login API error:', err);
      setError('Connection to server failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permissionType) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions && user.permissions[permissionType] === true;
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, logout, loginWithGoogle, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
