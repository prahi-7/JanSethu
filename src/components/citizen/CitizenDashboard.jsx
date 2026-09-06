import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock, 
  FaUser,
  FaArrowRight,
  FaFileAlt,
  FaMicrophone,
  FaVideo,
  FaImage
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const CitizenDashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    solved: 0,
    inProgress: 0,
    pending: 0,
  });
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    const map = {
      'In Progress': 'text-yellow-600 bg-yellow-50',
      'Solved': 'text-green-600 bg-green-50',
      'Under Review': 'text-blue-600 bg-blue-50',
      'Pending': 'text-gray-600 bg-gray-50',
    };
    return map[status] || 'text-gray-600 bg-gray-50';
  };

  const getPriorityColor = (priority) => {
    const map = {
      'High': 'bg-red-50 text-red-600',
      'Medium': 'bg-yellow-50 text-yellow-600',
      'Low': 'bg-blue-50 text-blue-600',
    };
    return map[priority] || 'bg-gray-50 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <div className="hidden md:block"><Sidebar role="citizen" /></div>
        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
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
      <div className="hidden md:block"><Sidebar role="citizen" /></div>
      
      <div className="flex-1 p-3 sm:p-4 md:p-8 ml-0 md:ml-64">
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700">Hello, Citizen 👋</h1>
          <p className="text-sm md:text-base text-gray-400">Track your reported problems</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">Total Reports</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#FFCABE]">{stats.totalReports}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#FFF5F2] rounded-full flex items-center justify-center">
                <FaFileAlt className="text-pink-400 text-base sm:text-lg md:text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">Solved</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-500">{stats.solved}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-50 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-400 text-base sm:text-lg md:text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">In Progress</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">{stats.inProgress}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <FaClock className="text-yellow-400 text-base sm:text-lg md:text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">Profile</p>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600">Citizen</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <FaUser className="text-purple-400 text-base sm:text-lg md:text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-8">
          <Link to="/citizen/report" className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-2 sm:p-3 md:p-4 text-center hover:shadow-md transition-all hover:border-[#FFCABE]">
            <FaFileAlt className="text-xl sm:text-2xl text-pink-400 mx-auto mb-1" />
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">Text</p>
          </Link>
          <Link to="/citizen/report" className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-2 sm:p-3 md:p-4 text-center hover:shadow-md transition-all hover:border-green-200">
            <FaMicrophone className="text-xl sm:text-2xl text-green-400 mx-auto mb-1" />
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">Voice</p>
          </Link>
          <Link to="/citizen/report" className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-2 sm:p-3 md:p-4 text-center hover:shadow-md transition-all hover:border-purple-200">
            <FaImage className="text-xl sm:text-2xl text-purple-400 mx-auto mb-1" />
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">Photo/Video</p>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-2">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-700">Recent Problems</h2>
            <Link to="/citizen/problems" className="text-[#FFCABE] hover:text-pink-700 text-xs sm:text-sm flex items-center">
              View All <FaArrowRight className="ml-1" />
            </Link>
          </div>

          {recentProblems.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-400">
              <FaCheckCircle className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm">No problems reported yet</p>
              <Link to="/citizen/report" className="text-[#FFCABE] hover:text-pink-700 text-sm mt-2 inline-block">
                Report your first problem →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/citizen/track/${problem.id}`}
                  className="block p-2 sm:p-3 md:p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all"
                >
                  {/* Problem details */}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
            <Link
              to="/citizen/report"
              className="w-full bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all block text-center text-sm sm:text-base shadow-[#FFCABE]/20"
            >
              Report a New Problem 🚀
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;