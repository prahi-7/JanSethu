import React, { useState } from 'react';
import { 
  FaChartBar, 
  FaUsers, 
  FaCheckCircle, 
  FaClock,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaFileAlt,
  FaUniversity,
  FaBuilding
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const Analytics = () => {
  const [loading, setLoading] = useState(false);

  const stats = [
    { label: 'Total Reports', value: '0', change: '+0%', color: 'text-[#FFCABE]', icon: <FaFileAlt className="text-pink-400" /> },
    { label: 'Resolution Rate', value: '0%', change: '+0%', color: 'text-green-500', icon: <FaCheckCircle className="text-green-400" /> },
    { label: 'Avg Resolution Time', value: '0 days', change: '-0d', color: 'text-purple-500', icon: <FaClock className="text-purple-400" /> },
    { label: 'Active Users', value: '0', change: '+0%', color: 'text-blue-500', icon: <FaUsers className="text-blue-400" /> },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="admin" />
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
      <Sidebar role="admin" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Analytics Dashboard</h1>
          <p className="text-sm md:text-base text-gray-400">Data-driven insights about the platform's performance</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] md:text-sm text-gray-400">{stat.label}</span>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className={`text-[10px] md:text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
            <FaChartBar className="text-pink-400" /> Platform Overview
          </h2>
          <div className="text-center py-8 md:py-12 text-gray-400">
            <FaChartBar className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-sm md:text-base">No data available yet</p>
            <p className="text-xs md:text-sm text-gray-300 mt-1">Analytics will appear once data is collected</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
              <FaUniversity className="text-purple-400" /> Top Universities
            </h2>
            <div className="text-center py-6 md:py-8 text-gray-400">
              <p className="text-sm">No data available</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
              <FaBuilding className="text-orange-400" /> Top Industries
            </h2>
            <div className="text-center py-6 md:py-8 text-gray-400">
              <p className="text-sm">No data available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;