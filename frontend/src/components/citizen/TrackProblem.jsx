import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaClock, 
  FaComments,
  FaMapMarkerAlt,
  FaCalendar,
  FaUser,
  FaTag,
  FaHeart
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const TrackProblem = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [id]);

  const getStatusIcon = (status) => {
    const map = {
      'completed': <FaCheck className="text-green-400" />,
      'in-progress': <FaClock className="text-yellow-400 animate-pulse" />,
      'pending': <FaClock className="text-gray-300" />,
    };
    return map[status] || map['pending'];
  };

  const getStatusColor = (status) => {
    const map = {
      'completed': 'border-green-300 bg-green-50/50',
      'in-progress': 'border-yellow-300 bg-yellow-50/50',
      'pending': 'border-gray-200 bg-gray-50/50',
    };
    return map[status] || map['pending'];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="citizen" />
        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-[#FFCABE] rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="citizen" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <Link to="/citizen/problems" className="text-[#FFCABE] hover:text-pink-700 flex items-center mb-4 text-sm group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to My Problems
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-700">Problem Title</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-3 py-1 bg-[#FFF5F2] text-[#D4A09A] rounded-full text-xs border border-[#FFCABE]">Category</span>
            <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs border border-red-200">High</span>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-500 rounded-full text-xs border border-yellow-200">In Progress</span>
          </div>
          <p className="text-gray-600 mt-4 text-sm md:text-base">Problem description goes here...</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-pink-400" /> Location</div>
            <div className="flex items-center gap-2"><FaCalendar className="text-pink-400" /> Date</div>
            <div className="flex items-center gap-2"><FaUser className="text-pink-400" /> Assigned to: Team</div>
            <div className="flex items-center gap-2"><FaTag className="text-pink-400" /> ID: #123</div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="font-semibold text-gray-700 mb-4">Progress Timeline</h2>
            <div className="space-y-4">
              {['Reported', 'Verified', 'Team Assigned', 'Solution Development', 'Testing', 'Deployment', 'Citizen Verification'].map((stage, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${index < 3 ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
                      {index < 3 ? <FaCheck className="text-green-400 text-xs" /> : <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>}
                    </div>
                    {index < 6 && <div className="w-0.5 h-6 bg-gray-200"></div>}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${index < 3 ? 'text-gray-700' : 'text-gray-400'}`}>{stage}</p>
                    {index < 3 && <p className="text-xs text-gray-400">2024-01-17</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-3">Recent Updates</h2>
            <div className="space-y-2">
              <div className="bg-[#FFF5F2]/50 rounded-xl p-3 border border-pink-100">
                <p className="text-sm text-gray-600">Problem reported successfully</p>
                <p className="text-xs text-gray-400 mt-1">2024-01-15 10:30 AM</p>
              </div>
              <div className="bg-[#FFF5F2]/50 rounded-xl p-3 border border-pink-100">
                <p className="text-sm text-gray-600">Team assigned: Environmental Engineering Team</p>
                <p className="text-xs text-gray-400 mt-1">2024-01-17 02:00 PM</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-[#FFF5F2] text-[#D4A09A] rounded-xl font-semibold hover:bg-pink-100 transition-all flex items-center gap-2 text-sm border border-[#FFCABE]">
              <FaComments /> Chat with Team
            </button>
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center gap-2 text-sm border border-blue-200">
              <FaHeart /> Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackProblem;