import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaList, 
  FaChartBar, 
  FaMapMarkedAlt, 
  FaCog,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUsers,
  FaBuilding,
  FaFileAlt,
  FaArrowRight,
  FaDownload,
  FaEye,
  FaUserTie
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const GovernmentDashboard = () => {
  const [stats] = useState({
    totalProblems: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0,
    departments: 0,
    teams: 0,
    escalated: 0,
    underReview: 0,
  });

  const [recentProblems] = useState([]);

  const getStatusBadge = (status) => {
    const map = {
      'Resolved': 'bg-green-50 text-green-600 border-green-200',
      'In Progress': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'Pending': 'bg-gray-50 text-gray-600 border-gray-200',
      'Under Review': 'bg-blue-50 text-blue-600 border-blue-200',
      'Escalated': 'bg-red-50 text-red-600 border-red-200',
    };
    return map[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="government" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-1">
            <FaUserTie className="text-3xl md:text-4xl text-red-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Government Dashboard</h1>
          </div>
          <p className="text-sm md:text-base text-gray-400">Monitor citizen problems across the state</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Total Problems</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">{stats.totalProblems}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Resolved</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">{stats.resolved}</p>
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <FaBuilding className="text-purple-400 text-sm md:text-base" />
              </div>
              <div>
                <p className="text-[10px] md:text-sm text-gray-400">Departments</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-purple-500">{stats.departments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <FaUsers className="text-orange-400 text-sm md:text-base" />
              </div>
              <div>
                <p className="text-[10px] md:text-sm text-gray-400">Active Teams</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-orange-500">{stats.teams}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-red-400 text-sm md:text-base" />
              </div>
              <div>
                <p className="text-[10px] md:text-sm text-gray-400">Escalated</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-red-500">{stats.escalated}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          <Link to="/government/problems" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-[#FFCABE] transition-all flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFF5F2] rounded-xl flex items-center justify-center">
              <FaList className="text-pink-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm">View All Problems</p>
              <p className="text-xs text-gray-400">Monitor citizen complaints</p>
            </div>
          </Link>
          <Link to="/government/departments" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FaBuilding className="text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm">Departments</p>
              <p className="text-xs text-gray-400">{stats.departments} active departments</p>
            </div>
          </Link>
          <Link to="/government/cpgrams" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-red-200 transition-all flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <FaExclamationTriangle className="text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm">CPGRAMS</p>
              <p className="text-xs text-gray-400">{stats.escalated} escalated problems</p>
            </div>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-bold text-gray-700">Recent Problems</h2>
            <Link to="/government/problems" className="text-[#FFCABE] hover:text-pink-700 text-xs md:text-sm flex items-center">
              View All <FaArrowRight className="ml-1" />
            </Link>
          </div>
          
          {recentProblems.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-400">
              <FaFileAlt className="text-3xl md:text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm md:text-base">No problems reported yet</p>
              <p className="text-xs md:text-sm text-gray-300 mt-1">Problems will appear here once citizens start reporting</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50">
                  <tr>
                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">Title</th>
                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">Department</th>
                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">Date</th>
                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentProblems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-white/30 transition-colors">
                      <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-600">{problem.title}</td>
                      <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-500">{problem.department}</td>
                      <td className="px-3 md:px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border ${getStatusBadge(problem.status)}`}>
                          {problem.status}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-400">{problem.date}</td>
                      <td className="px-3 md:px-4 py-2">
                        <button className="text-pink-400 hover:text-[#D4A09A] transition-colors">
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;