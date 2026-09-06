import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt,
  FaEye,
  FaArrowRight
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const ProblemMap = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    solved: 0,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="admin" />
        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-[#FFCABE] rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading map...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Problem Map</h1>
          <p className="text-sm md:text-base text-gray-400">Visualize problems across the region</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-2 md:p-3 text-center hover:shadow-md transition-all">
            <p className="text-[10px] md:text-xs text-gray-400">Total</p>
            <p className="text-lg md:text-xl font-bold text-[#FFCABE]">{stats.total}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-2 md:p-3 text-center hover:shadow-md transition-all">
            <p className="text-[10px] md:text-xs text-gray-400">High</p>
            <p className="text-lg md:text-xl font-bold text-red-500">{stats.high}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-2 md:p-3 text-center hover:shadow-md transition-all">
            <p className="text-[10px] md:text-xs text-gray-400">Medium</p>
            <p className="text-lg md:text-xl font-bold text-yellow-500">{stats.medium}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-2 md:p-3 text-center hover:shadow-md transition-all">
            <p className="text-[10px] md:text-xs text-gray-400">Low</p>
            <p className="text-lg md:text-xl font-bold text-blue-500">{stats.low}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-2 md:p-3 text-center hover:shadow-md transition-all">
            <p className="text-[10px] md:text-xs text-gray-400">Solved</p>
            <p className="text-lg md:text-xl font-bold text-green-500">{stats.solved}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-3 md:mb-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base">
                <option>All Priority</option>
              </select>
              <select className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base">
                <option>All Status</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-3 md:mb-4">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-[10px] md:text-xs text-gray-600">High</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-[10px] md:text-xs text-gray-600">Medium</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-[10px] md:text-xs text-gray-600">Low</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-[10px] md:text-xs text-gray-600">Solved</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 ml-auto">
              <FaMapMarkerAlt className="text-gray-400 text-xs md:text-sm" />
              <span className="text-[10px] md:text-xs text-gray-500">{filteredProblems.length} locations</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 h-[350px] md:h-[450px] flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FaMapMarkerAlt className="text-4xl md:text-6xl text-gray-300 mx-auto mb-3" />
            <p className="text-sm md:text-base">No problems on map</p>
            <p className="text-xs md:text-sm text-gray-300 mt-1">Problems will appear here once reported</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemMap;