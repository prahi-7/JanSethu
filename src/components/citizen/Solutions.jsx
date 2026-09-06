import React, { useState, useEffect } from 'react';
import { FaSearch, FaStar, FaDownload, FaEye, FaHeart } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">Solutions Library</h1>
        <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Browse successful solutions from across the platform</p>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4 md:mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search solutions..."
              className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
            />
          </div>
        </div>

        {solutions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaStar className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No solutions available yet</p>
            <p className="text-sm text-gray-400 mt-1">Solutions will appear once problems are solved</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {solutions.map((solution) => (
              <div key={solution.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all hover:border-[#FFCABE]">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-[#FFF5F2] text-[#D4A09A] rounded-full text-xs border border-[#FFCABE]">Category</span>
                  <div className="flex items-center text-yellow-400"><FaStar /> <span className="ml-1 text-sm text-gray-600">4.5</span></div>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mt-2">Solution Title</h3>
                <p className="text-sm text-gray-500">Solution description goes here...</p>
                <div className="mt-3 space-y-1 text-sm text-gray-500">
                  <p><span className="font-medium text-gray-600">Success Rate:</span> 92%</p>
                  <p><span className="font-medium text-gray-600">Cost:</span> ₹ 50,000</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2">
                    <FaEye /> View Details
                  </button>
                  <button className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm">
                    <FaDownload />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Solutions;