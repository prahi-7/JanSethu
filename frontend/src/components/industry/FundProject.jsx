import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaDollarSign, 
  FaHandshake,
  FaCheckCircle,
  FaClock,
  FaInfoCircle,
  FaArrowRight,
  FaHeart,
  FaCoins,
  FaFileInvoice,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMoneyBillWave,
  FaTools,
  FaUserTie,
  FaSearch,
  FaProjectDiagram
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const FundProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Project Details - Manual Entry
    projectId: projectId || '',
    projectName: '',
    // Personal Details
    name: '',
    email: '',
    phone: '',
    company: '',
    // Funding Details
    amount: '',
    fundingType: 'equipment',
    description: '',
    timeline: '3',
    // Additional Details
    transactionId: '',
    remarks: '',
  });

  const fundingTypes = [
    { value: 'equipment', label: 'Equipment & Materials', icon: <FaTools /> },
    { value: 'mentorship', label: 'Mentorship & Expertise', icon: <FaUserTie /> },
    { value: 'cash', label: 'Cash Funding', icon: <FaMoneyBillWave /> },
    { value: 'infrastructure', label: 'Infrastructure Support', icon: <FaBuilding /> },
    { value: 'other', label: 'Other', icon: <FaHeart /> },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { projectId, projectName, name, email, amount, fundingType } = formData;
    if (!projectId || !projectName || !name || !email || !amount || !fundingType) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(`Funding committed successfully for ${projectName}! 🎉`);
      setLoading(false);
      navigate('/industry/dashboard');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5F2] pt-16">
      <Sidebar role="industry" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <Link to="/industry/dashboard" className="text-[#D4A09A] hover:text-[#8B5E5E] flex items-center mb-4 text-sm group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FaCoins className="text-3xl text-[#D4A09A]" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Fund Project</h1>
          </div>
          <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Provide funding or resources to support a project</p>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6">
            {/* Project Details Section - Manual Entry */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-[#FFF5F2] rounded-xl border border-[#FFCABE]">
              <h3 className="font-semibold text-[#D4A09A] text-sm md:text-base flex items-center gap-2 mb-3">
                <FaProjectDiagram className="text-[#D4A09A]" /> Project Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                    Project ID <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="projectId"
                      value={formData.projectId}
                      onChange={handleChange}
                      placeholder="e.g., P-2024-001"
                      className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FaProjectDiagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="e.g., Smart Waste Segregation System"
                      className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 md:space-y-5">
                {/* Personal Details Section */}
                <div className="border-b border-[#FFCABE] pb-4">
                  <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-[#D4A09A]" /> Your Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Phone</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Company</label>
                      <div className="relative">
                        <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your company name"
                          className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Funding Details Section */}
                <div className="border-b border-[#FFCABE] pb-4">
                  <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaCoins className="text-[#D4A09A]" /> Funding Details
                  </h2>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                        Funding Amount <span className="text-red-400">*</span> <span className="text-xs text-gray-400">(in INR)</span>
                      </label>
                      <div className="relative">
                        <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="Enter amount in INR"
                          className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                        Funding Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="fundingType"
                        value={formData.fundingType}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                        required
                      >
                        {fundingTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Describe what you're funding and any conditions..."
                        className="w-full px-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Timeline (months)</label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} month{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaFileInvoice className="text-[#D4A09A]" /> Additional Details
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Transaction ID (Optional)</label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        placeholder="Enter transaction ID"
                        className="w-full px-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Remarks</label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Any additional remarks..."
                        className="w-full px-3 py-2.5 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Funding Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FFCABE] text-[#8B5E5E] py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE]/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:scale-[1.02] text-sm md:text-base"
                >
                  <FaHandshake />
                  {loading ? 'Processing...' : 'Commit Funding'}
                </button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-[#FFF5F2] rounded-xl border border-[#FFCABE] text-center">
              <p className="text-xs text-gray-500">💝 Your contribution will make a difference!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundProject;