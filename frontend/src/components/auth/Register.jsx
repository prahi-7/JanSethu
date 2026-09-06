import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaGraduationCap, 
  FaBuilding, 
  FaUserGraduate,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaUniversity,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTie,
  FaIndustry,
  FaCheckCircle,
  FaFlask
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    universityName: '',
    universityDepartment: '',
    universityAddress: '',
    researchAreas: '',
    company: '',
    companyAddress: '',
    industryType: '',
    organization: '',
    designation: '',
    departmentName: '',
    address: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'citizen', label: 'Citizen', icon: <FaUser /> },
    { value: 'university', label: 'University', icon: <FaUniversity /> },
    { value: 'industry', label: 'Industry', icon: <FaIndustry /> },
    { value: 'government', label: 'Government', icon: <FaUserTie /> },
  ];

  const departments = [
    'Computer Science Engineering', 'Information Technology', 'Electronics & Communication',
    'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
    'Biotechnology', 'Environmental Science', 'Data Science', 'Artificial Intelligence',
    'Robotics', 'Physics', 'Chemistry', 'Mathematics', 'Commerce', 'Management Studies',
    'Law', 'Medicine', 'Nursing', 'Pharmacy', 'Architecture', 'Design', 'Journalism', 'Others'
  ];

  const industryTypes = [
    'Technology / IT', 'Manufacturing', 'Healthcare', 'Education', 'Agriculture',
    'Energy', 'Construction', 'Finance', 'Consulting', 'Research & Development',
    'Non-Profit / NGO', 'Government', 'Others'
  ];

  const governmentDepartments = [
    'Water Resources', 'Public Works', 'Education', 'Health & Family Welfare',
    'Agriculture', 'Energy', 'Environment', 'Transport', 'Housing & Urban Development',
    'Rural Development', 'Panchayati Raj', 'Police', 'Others'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!agreed) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    if (formData.role === 'university' && !formData.universityName) {
      toast.error('Please enter University Name');
      return;
    }
    if (formData.role === 'industry' && !formData.company) {
      toast.error('Please enter Company Name');
      return;
    }
    if (formData.role === 'government' && !formData.organization) {
      toast.error('Please enter Organization Name');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F2] pt-20 pb-12 px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-lg border border-[#FFCABE] relative">
        <Link to="/" className="absolute top-3 left-3 md:top-4 md:left-4 text-gray-400 hover:text-[#D4A09A] transition-colors flex items-center gap-2 text-xs md:text-sm group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FFCABE] rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-[#FFCABE]/30 hover:shadow-xl transition-all hover:scale-105">
            <span className="text-[#8B5E5E] font-bold text-2xl md:text-3xl">JS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">Create Account 🚀</h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Join JanSethu and start solving problems</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 max-h-[60vh] md:max-h-[65vh] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1 md:mb-2">I am a... *</label>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-center justify-center space-x-1 md:space-x-2 p-2 md:p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.role === role.value
                      ? 'border-[#FFCABE] bg-[#FFF5F2] text-[#D4A09A] shadow-sm shadow-[#FFCABE]/20'
                      : 'border-gray-200 hover:border-[#FFCABE] hover:bg-[#FFF5F2] text-gray-500 hover:text-[#D4A09A]'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-base md:text-lg">{role.icon}</span>
                  <span className="text-[10px] md:text-xs font-medium">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Full Name *</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Email *</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Password *</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full pl-9 md:pl-10 pr-10 md:pr-12 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                required
                minLength="6"
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

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Confirm Password *</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                required
              />
            </div>
          </div>

          {formData.role === 'university' && (
            <div className="border border-[#FFCABE] rounded-xl p-3 md:p-4 bg-[#FFF5F2] space-y-2 md:space-y-3">
              <h3 className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaUniversity className="text-[#D4A09A]" /> University Details
              </h3>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">University Name *</label>
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                  placeholder="Enter University Name"
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">Department</label>
                <select
                  name="universityDepartment"
                  value={formData.universityDepartment}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm md:text-base"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">Research Areas</label>
                <textarea
                  name="researchAreas"
                  value={formData.researchAreas}
                  onChange={handleChange}
                  placeholder="e.g., AI, Machine Learning, Sustainable Energy"
                  rows="2"
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                />
              </div>
            </div>
          )}

          {formData.role === 'industry' && (
            <div className="border border-orange-200 rounded-xl p-3 md:p-4 bg-orange-50/50 space-y-2 md:space-y-3">
              <h3 className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaIndustry className="text-orange-400" /> Industry Details
              </h3>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">Industry Type</label>
                <select
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm md:text-base"
                >
                  <option value="">Select Industry Type</option>
                  {industryTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formData.role === 'government' && (
            <div className="border border-red-200 rounded-xl p-3 md:p-4 bg-red-50/50 space-y-2 md:space-y-3">
              <h3 className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaUserTie className="text-red-400" /> Government Details
              </h3>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">Organization *</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Enter Organization Name"
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter Designation"
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                />
              </div>
            </div>
          )}

          {formData.role === 'citizen' && (
            <div className="border border-blue-200 rounded-xl p-3 md:p-4 bg-blue-50/50 space-y-2 md:space-y-3">
              <h3 className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaUser className="text-blue-400" /> Citizen Details
              </h3>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 placeholder-gray-400 text-sm md:text-base"
                />
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 md:gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-3 h-3 md:w-4 md:h-4 text-[#FFCABE] border-gray-300 rounded focus:ring-[#FFCABE]"
            />
            <label htmlFor="terms" className="text-[10px] md:text-sm text-gray-500">
              I agree to the Terms & Conditions and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFCABE] text-[#8B5E5E] py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE]/30 transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2 text-sm md:text-base"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#8B5E5E] border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              'Create Account 🚀'
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-3 md:mt-4 text-xs md:text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D4A09A] hover:text-[#8B5E5E] font-semibold transition-colors">
            Login here
          </Link>
        </p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #FFF5F2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFCABE;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #E8B5A9;
        }
      `}</style>
    </div>
  );
};

export default Register;