import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaIdCard, 
  FaUser, 
  FaUserPlus, 
  FaArrowLeft,
  FaUniversity,
  FaLock,
  FaGraduationCap,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle
} from 'react-icons/fa';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regNo: '',
    department: '',
    year: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const departments = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Environmental Science',
    'Data Science',
    'Artificial Intelligence',
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
    'Others',
  ];

  const yearsOfStudy = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Post Graduate',
    'PhD',
    'Research Scholar',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, regNo, password, confirmPassword } = formData;
    
    if (!name || !email || !regNo || !password) {
      toast.error('Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!agreed) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Registration successful! 🎉 Please login.');
      setLoading(false);
      navigate('/university/login');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-16">
      <Sidebar role="university" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
        <div className="max-w-lg w-full">
          {/* Back Button */}
          <Link to="/university/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mb-6 transition-colors group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>

          {/* Register Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/40">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/30 hover:scale-105 transition-transform">
                <FaUserPlus className="text-4xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Create Account 🚀</h1>
              <p className="text-gray-500 mt-1">Join JanSethu and start solving problems</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Register No *</label>
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaGraduationCap />
                    </div>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 appearance-none transition-all"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Year of Study</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaCalendarAlt />
                    </div>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 appearance-none transition-all"
                    >
                      <option value="">Select Year</option>
                      {yearsOfStudy.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaLock />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3.5 rounded-2xl font-semibold hover:shadow-xl shadow-green-500/30 transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registering...
                  </>
                ) : (
                  <><FaUserPlus /> Create Account</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-sm text-gray-400">Already have an account?</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Login Link */}
            <Link
              to="/university/login"
              className="block w-full text-center py-3.5 border-2 border-blue-200 text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              Login to Existing Account 🔑
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default StudentRegister;