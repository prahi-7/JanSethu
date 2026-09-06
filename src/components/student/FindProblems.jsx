import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const FindProblems = () => {
  const [problems] = useState([]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">Find Problems</h1>
        <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Browse available problems to solve</p>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base">
                <option>All Categories</option>
              </select>
              <button className="px-3 md:px-4 py-2 bg-[#FFF5F2] text-[#D4A09A] rounded-xl hover:bg-pink-100 transition-all flex items-center gap-2 text-sm">
                <FaFilter /> Filter
              </button>
            </div>
          </div>
        </div>

        {problems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaSearch className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No problems available</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for new problems</p>
          </div>
        ) : (
          <div className="space-y-4">
            {problems.map((problem) => (
              <div key={problem.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all">
                {/* Problem details */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindProblems;