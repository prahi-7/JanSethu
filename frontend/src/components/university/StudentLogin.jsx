import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaIdCard, 
  FaUser, 
  FaSignInAlt, 
  FaArrowLeft,
  FaLock,
  FaGraduationCap,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const StudentLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regNo: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, regNo, password } = formData;

    if (!name || !email || !regNo || !password) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(
          responseData.message ||
          responseData.errors?.[0] ||
          'Invalid email or password'
        );
      }

      // Your backend returns the actual data inside responseData.data
      const user = responseData.data?.user;
      const token = responseData.data?.token;

      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      // Student login must only allow student accounts
      if (user.role !== 'student') {
        throw new Error(
          'This account is not registered as a student'
        );
      }

      // Inactive accounts cannot log in
      if (user.isActive === false) {
        throw new Error(
          'Your student account is inactive. Please contact the administrator.'
        );
      }

      // Check registration number
      const databaseRegNo =
        user.regNo ||
        user.registrationNumber ||
        user.registrationNo;

      if (
        databaseRegNo &&
        databaseRegNo.toString().trim().toLowerCase() !==
          regNo.trim().toLowerCase()
      ) {
        throw new Error(
          'Registration number does not match this account'
        );
      }

      // Check name
      if (
        user.name &&
        user.name.trim().toLowerCase() !==
          name.trim().toLowerCase()
      ) {
        throw new Error(
          'Name does not match this account'
        );
      }

      // Save authentication information
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      // Use only actual database information
      const student = {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        regNo:
          user.regNo ||
          user.registrationNumber ||
          user.registrationNo ||
          regNo,
        department: user.department,
        year: user.year,
        university: user.university,
        role: user.role,
        isActive: user.isActive,
      };

      toast.success(`Welcome ${user.name || name}! 🎉`);

      navigate('/student/dashboard', {
        state: {
          student,
        },
      });

    } catch (error) {
      console.error('Student login error:', error);

      toast.error(
        error.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16">
      <Sidebar role="university" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
        <div className="max-w-md w-full">

          {/* Back Button */}
          <Link
            to="/university/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mb-6 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/40">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform">
                <FaGraduationCap className="text-4xl text-white" />
              </div>

              <h1 className="text-3xl font-bold text-gray-800">
                Welcome Back! 👋
              </h1>

              <p className="text-gray-500 mt-1">
                Login to access your projects and teams
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>

                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaUser />
                  </div>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>

                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaEnvelope />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Register No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Register No
                </label>

                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaIdCard />
                  </div>

                  <input
                    type="text"
                    name="regNo"
                    placeholder="Enter Registration No"
                    value={formData.regNo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>

                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaLock />
                  </div>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-2xl font-semibold hover:shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <FaSignInAlt /> Login
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

              <span className="text-sm text-gray-400">
                New Student?
              </span>

              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Register Link */}
            <Link
              to="/university/register"
              className="block w-full text-center py-3.5 border-2 border-blue-200 text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              Create New Account 🚀
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;