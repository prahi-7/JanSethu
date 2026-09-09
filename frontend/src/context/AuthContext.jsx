import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import socketService from '../services/socket';

const AuthContext = createContext();

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  // Set up axios defaults
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('jwt_token');
      const storedUser = localStorage.getItem('user_data');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Connect socket after restoring session
          socketService.connect(storedToken, parsedUser._id);
        } catch (error) {
          console.error('Error loading user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 🔐 REGISTER - REAL BACKEND
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        // Additional fields for specific roles
        university: userData.universityName,
        department: userData.universityDepartment,
        organization: userData.company || userData.organization,
        designation: userData.designation,
        phone: userData.phone,
        address: userData.address,
      });

      console.log('✅ Registration response:', response.data);

      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Save to localStorage
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        setToken(token);
        
        // Connect socket after successful registration
        socketService.connect(token, user._id);
        
        toast.success('✅ Registration successful! Welcome to JanSetu!');
        return { success: true, user, token };
      } else {
        toast.error(response.data.message || 'Registration failed');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 🔐 LOGIN - REAL BACKEND
  const login = async (email, password, role) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      console.log('✅ Login response:', response.data);

      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Verify role matches selected
        if (user.role !== role) {
          toast.error(`You are registered as ${user.role}, not ${role}. Please select the correct role.`);
          setLoading(false);
          return { success: false, error: 'Role mismatch' };
        }

        // Save to localStorage
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        setToken(token);
        
        // Connect socket after successful login
        socketService.connect(token, user._id);
        
        toast.success(`✅ Welcome back, ${user.name}!`);
        return { success: true, user, token };
      } else {
        toast.error(response.data.message || 'Login failed');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    // Disconnect socket
    socketService.disconnect();
    
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  // 👤 GET CURRENT USER
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('user_data', JSON.stringify(user));
        setUser(user);
        return user;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  // 📝 UPDATE PROFILE
  const updateProfile = async (data) => {
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile`, data);
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('user_data', JSON.stringify(user));
        setUser(user);
        toast.success('Profile updated successfully!');
        return { success: true, user };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;