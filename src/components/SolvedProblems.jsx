import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaStar, 
  FaSearch,
  FaMapMarkerAlt,
  FaCalendar,
  FaUsers,
  FaUniversity,
  FaBuilding,
  FaArrowRight,
  FaDownload,
  FaEye,
  FaFilter,
  FaArrowLeft
} from 'react-icons/fa';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

const SolvedProblems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [solvedProblems] = useState([]);

  const categories = ['All', 'Water & Sanitation', 'Energy', 'Waste Management', 'Education', 'Healthcare', 'Infrastructure'];
  const universities = ['All', 'IIT Dhanbad', 'BIT Mesra', 'NIT Jamshedpur'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 pt-20 pb-12 md:pt-28 md:pb-20">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-[#FFCABE] hover:text-pink-700 transition-colors mb-6 md:mb-10 text-sm group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FaCheckCircle className="text-3xl md:text-4xl text-green-400" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Solved Problems</h1>
          </div>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            Browse all problems that have been successfully solved by our community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 text-center hover:shadow-md transition-all">
            <p className="text-xl md:text-2xl font-bold text-green-500">{solvedProblems.length}</p>
            <p className="text-[10px] md:text-sm text-gray-500">Total Solved</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 text-center hover:shadow-md transition-all">
            <p className="text-xl md:text-2xl font-bold text-blue-500">0</p>
            <p className="text-[10px] md:text-sm text-gray-500">Avg Rating</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 text-center hover:shadow-md transition-all">
            <p className="text-xl md:text-2xl font-bold text-purple-500">0</p>
            <p className="text-[10px] md:text-sm text-gray-500">Universities</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 text-center hover:shadow-md transition-all">
            <p className="text-xl md:text-2xl font-bold text-orange-500">0</p>
            <p className="text-[10px] md:text-sm text-gray-500">Industries</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search solved problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === 'All' ? 'all' : cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filterUniversity}
                onChange={(e) => setFilterUniversity(e.target.value)}
                className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              >
                {universities.map(uni => (
                  <option key={uni} value={uni === 'All' ? 'all' : uni}>{uni}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">Showing {solvedProblems.length} solved problems</p>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {solvedProblems.length === 0 ? (
            <div className="col-span-2 text-center py-8 md:py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100">
              <FaCheckCircle className="text-4xl md:text-6xl text-gray-300 mx-auto mb-3 md:mb-4" />
              <p className="text-base md:text-lg text-gray-500">No solved problems found</p>
              <p className="text-sm text-gray-400 mt-1 md:mt-2">Be the first to solve a problem!</p>
              <Link to="/student/find-problems" className="inline-block mt-3 md:mt-4 text-[#FFCABE] hover:text-pink-700 transition-colors text-sm md:text-base">
                Find problems to solve →
              </Link>
            </div>
          ) : (
            solvedProblems.map((problem) => (
              <div key={problem.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all hover:border-green-200">
                {/* Problem details will be populated from API */}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SolvedProblems;