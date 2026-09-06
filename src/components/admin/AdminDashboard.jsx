import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaList, 
  FaUsers, 
  FaChartBar, 
  FaMapMarkedAlt, 
  FaCog,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowRight,
  FaUniversity,
  FaBuilding,
  FaUserTie
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const AdminDashboard = () => {
  const [stats] = useState({
    totalProblems: 0,
    solved: 0,
    inProgress: 0,
    pending: 0,
    totalUsers: 0,
    solutionsCreated: 0,
    solutionsReused: 0,
    universities: 0,
    industryPartners: 0,
    activeTeams: 0,
  });

  const [recentProblems] = useState([]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-400">Overview of the entire JanSethu platform</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Total Problems</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">{stats.totalProblems}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Solved</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">{stats.solved}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">In Progress</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">{stats.inProgress}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Pending</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-500">{stats.pending}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Total Users</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-500">{stats.totalUsers}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Universities</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500">{stats.universities}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Industry Partners</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-500">{stats.industryPartners}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Active Teams</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#FFCABE]">{stats.activeTeams}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <Link to="/admin/problems" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-[#FFCABE] transition-all flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FFF5F2] rounded-xl flex items-center justify-center">
              <FaList className="text-pink-400 text-sm md:text-base" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-xs md:text-sm">Problems</p>
              <p className="text-[10px] md:text-xs text-gray-400">Manage all problems</p>
            </div>
          </Link>
          <Link to="/admin/users" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FaUsers className="text-purple-400 text-sm md:text-base" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-xs md:text-sm">Users</p>
              <p className="text-[10px] md:text-xs text-gray-400">Manage users</p>
            </div>
          </Link>
          <Link to="/admin/cpgrams" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-red-200 transition-all flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <FaExternalLinkAlt className="text-red-400 text-sm md:text-base" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-xs md:text-sm">CPGRAMS</p>
              <p className="text-[10px] md:text-xs text-gray-400">Escalate problems</p>
            </div>
          </Link>
          <Link to="/admin/settings" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-xl flex items-center justify-center">
              <FaCog className="text-gray-400 text-sm md:text-base" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-xs md:text-sm">Settings</p>
              <p className="text-[10px] md:text-xs text-gray-400">Admin settings</p>
            </div>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-bold text-gray-700">Recent Problems</h2>
            <Link to="/admin/problems" className="text-[#FFCABE] hover:text-pink-700 text-xs md:text-sm flex items-center">
              View All <FaArrowRight className="ml-1" />
            </Link>
          </div>
          
          {recentProblems.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-400">
              <FaCheckCircle className="text-3xl md:text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm md:text-base">No problems reported yet</p>
              <p className="text-xs md:text-sm text-gray-300 mt-1">Problems will appear here once citizens start reporting</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProblems.map((problem) => (
                <div key={problem.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  {/* Problem details */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;