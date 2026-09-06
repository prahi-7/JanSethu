import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Store registered users
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      let userData;

      // ✅ Admin login - jansethu@123 / sethu
      if (email === 'jansethu@123' && password === 'sethu') {
        // Role-based admin login
        const roleMap = {
          citizen: { id: 'citizen-001', name: 'Citizen User', role: 'citizen' },
          student: { id: 'student-001', name: 'Student User', role: 'student' },
          university: { id: 'university-001', name: 'IIT Dhanbad', role: 'university' },
          admin: { id: 'admin-001', name: 'Admin User', role: 'admin' },
          government: { id: 'gov-001', name: 'Government Officer', role: 'government' },
          industry: { id: 'industry-001', name: 'Industry Partner', role: 'industry' },
        };
        
        userData = roleMap[role] || roleMap['citizen'];
        userData.email = email;
      }
      // ✅ Registered user login - Check if user exists in registered users
      else {
        const registeredUser = registeredUsers.find(
          (u) => u.email === email && u.role === role
        );
        
        if (!registeredUser) {
          toast.error('User not found. Please register first.');
          setLoading(false);
          throw new Error('User not found');
        }
        
        userData = {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          role: registeredUser.role,
          // Additional fields based on role
          ...(registeredUser.role === 'student' && {
            regNo: registeredUser.regNo,
            department: registeredUser.department || 'Computer Science Engineering',
            year: registeredUser.year || '3rd Year',
            university: registeredUser.university || 'IIT Dhanbad',
          }),
          ...(registeredUser.role === 'university' && {
            universityName: registeredUser.universityName || 'IIT Dhanbad',
            department: registeredUser.department || 'Computer Science Engineering',
          }),
          ...(registeredUser.role === 'industry' && {
            company: registeredUser.company,
            industryType: registeredUser.industryType,
          }),
          ...(registeredUser.role === 'government' && {
            organization: registeredUser.organization,
            designation: registeredUser.designation,
          }),
        };
      }

      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success(`Welcome ${userData.name}! 🎉`);
      return { user: userData };
    } catch (error) {
      toast.error('Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      // Save to registered users
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      toast.success('Registration successful! Please login.');
      return { success: true, user: newUser };
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    setUser,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!token,
    isCitizen: user?.role === 'citizen',
    isStudent: user?.role === 'student',
    isAdmin: user?.role === 'admin',
    isUniversity: user?.role === 'university',
    isGovernment: user?.role === 'government',
    isIndustry: user?.role === 'industry',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;