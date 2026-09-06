import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowLeft, 
  FaUser, 
  FaUserTie, 
  FaIndustry,
  FaUserShield,
  FaUniversity
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'citizen', label: 'Citizen', icon: <FaUser /> },
    { value: 'university', label: 'University', icon: <FaUniversity /> },
    { value: 'industry', label: 'Industry', icon: <FaIndustry /> },
    { value: 'government', label: 'Government', icon: <FaUserTie /> },
    { value: 'admin', label: 'Admin', icon: <FaUserShield /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await login(email, password, selectedRole);
      const roleMap = {
        citizen: '/citizen/dashboard',
        university: '/university/dashboard',
        admin: '/admin/dashboard',
        government: '/government/dashboard',
        industry: '/industry/dashboard',
      };
      navigate(roleMap[response.user.role] || '/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F2] pt-20 pb-12 px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-md border border-[#FFCABE] relative">
        <Link to="/" className="absolute top-3 left-3 md:top-4 md:left-4 text-gray-400 hover:text-[#D4A09A] transition-colors flex items-center gap-2 text-xs md:text-sm group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FFCABE] rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-[#FFCABE]/30 hover:shadow-xl transition-all hover:scale-105">
            <span className="text-[#8B5E5E] font-bold text-2xl md:text-3xl">JS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">Welcome Back! 👋</h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Login to your JanSethu account</p>
          <div className="mt-2 inline-block px-3 py-1 bg-[#FFCABE] border border-[#FFCABE] rounded-full text-[10px] md:text-xs text-[#8B5E5E] font-medium">
            🔑 Admin: jansethu@123 / sethu
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1 md:mb-2">Select Your Role</label>
            <div className="grid grid-cols-3 gap-1.5 md:gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`flex flex-col items-center justify-center gap-0.5 md:gap-1 p-2 md:p-3 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                    selectedRole === role.value
                      ? 'border-[#FFCABE] bg-[#FFF5F2] text-[#D4A09A] shadow-md shadow-[#FFCABE]/20'
                      : 'border-gray-200 text-gray-500 hover:border-[#FFCABE] hover:bg-[#FFF5F2]'
                  }`}
                >
                  <span className="text-base md:text-xl">{role.icon}</span>
                  <span className="text-[8px] md:text-xs font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <div className="relative group">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4A09A] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] focus:border-transparent text-gray-700 transition-all placeholder-gray-400 text-sm md:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Password</label>
            <div className="relative group">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4A09A] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 md:pl-10 pr-10 md:pr-12 py-2.5 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] focus:border-transparent text-gray-700 transition-all placeholder-gray-400 text-sm md:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#D4A09A] transition-colors"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFCABE] text-[#8B5E5E] py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE]/30 transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2 text-sm md:text-base"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#8B5E5E] border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              'Login 🚀'
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4 md:mt-6 text-xs md:text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#D4A09A] hover:text-[#8B5E5E] font-semibold transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;