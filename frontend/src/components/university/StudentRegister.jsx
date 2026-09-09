import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaUniversity,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
  FaGraduationCap
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const StudentRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regNo: '',
    university: '',
    department: '',
    year: '',
    password: '',
    confirmPassword: ''
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = [
    'CSE',
    'IT',
    'ECE',
    'Electrical',
    'Mechanical',
    'Civil',
    'Chemical',
    'Biotechnology',
    'Environmental Science',
    'Data Science',
    'AI',
    'Robotics',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Commerce',
    'Management Studies',
    'Law',
    'Medicine',
    'Nursing',
    'Pharmacy',
    'Architecture',
    'Design',
    'Journalism',
    'Others'
  ];

  const yearsOfStudy = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Post Graduate',
    'PhD',
    'Research Scholar'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      regNo,
      university,
      department,
      year,
      password,
      confirmPassword
    } = formData;

    // Required field validation
    if (!name.trim() || !email.trim() || !regNo.trim() || !university.trim() || !password) {
      toast.error('Please fill all required fields');
      return;
    }

    // Password validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Terms validation
    if (!agreed) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role: 'student',
          regNo: regNo.trim(),
          university: university.trim(),

          // Send these only when selected
          ...(department && { department }),
          ...(year && { year })
        })
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(
          responseData.message ||
          responseData.errors?.[0] ||
          'Registration failed'
        );
      }

      toast.success('Registration successful! 🎉 Please login.');

      // Go to Student Login
      navigate('/university/login');

    } catch (error) {
      console.error('Student registration error:', error);

      toast.error(
        error.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex">

      {/* Sidebar */}
      <Sidebar role="university" />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">

        {/* Back Button */}
        <Link
          to="/university/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>

        <div className="max-w-3xl mx-auto">

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-7 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-xl">
                  <FaGraduationCap className="text-3xl" />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Student Registration
                  </h1>

                  <p className="text-green-100 mt-1">
                    Create a student account to access JanSethu
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="regNo"
                      value={formData.regNo}
                      onChange={handleChange}
                      placeholder="Enter registration number"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* University / College */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    University / College <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FaUniversity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      placeholder="Enter your university / college"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      disabled={loading}
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Enter the official name of your university or college.
                  </p>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>

                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                      disabled={loading}
                    >
                      <option value="">
                        Select your department
                      </option>

                      {departments.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year of Study
                  </label>

                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                    disabled={loading}
                  >
                    <option value="">
                      Select year
                    </option>

                    {yearsOfStudy.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Terms */}
              <div className="mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    disabled={loading}
                  />

                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <span className="text-green-600 font-semibold">
                      Terms and Conditions
                    </span>{' '}
                    and confirm that the information provided is accurate.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3.5 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Create Student Account
                  </>
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have a student account?{' '}
                <Link
                  to="/university/login"
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Login here
                </Link>
              </p>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentRegister;