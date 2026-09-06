import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaHandshake, 
  FaUsers, 
  FaArrowRight,
  FaFilter,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaDollarSign,
  FaTools,
  FaMapMarkerAlt,
  FaHeart
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const IndustryProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleSupport = (id) => {
    toast.success('Support request sent successfully! 🎉');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="industry" />
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
      <Sidebar role="industry" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Available Projects</h1>
          <p className="text-sm md:text-base text-gray-400">Find projects that need your industry expertise and resources</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              >
                <option value="all">All Categories</option>
              </select>
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaHandshake className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No projects available</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for new projects</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all hover:border-[#FFCABE]">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 md:gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-700">{project.title}</h3>
                      <span className="px-2 py-0.5 bg-[#FFF5F2] text-[#D4A09A] rounded-full text-xs border border-[#FFCABE]">{project.category}</span>
                      <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full text-xs border border-yellow-200">{project.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><FaUsers /> {project.team}</span>
                      <span className="flex items-center gap-1"><FaMapMarkerAlt /> {project.location}</span>
                      <span className="flex items-center gap-1"><FaClock /> {project.timeline}</span>
                      <span className="flex items-center gap-1"><FaDollarSign /> {project.budget}</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">Required Resources:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.requiredResources.map((resource, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs flex items-center gap-1 text-gray-600">
                            <FaTools className="text-gray-400 text-[10px]" /> {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <button
                      onClick={() => handleSupport(project.id)}
                      className="bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <FaHandshake /> Offer Support
                    </button>
                    <Link to={`/industry/project/${project.id}`} className="border border-[#FFCABE] text-[#D4A09A] py-2 px-4 rounded-xl font-semibold hover:bg-[#FFF5F2] transition-all flex items-center justify-center gap-2 text-sm">
                      <FaEye /> View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryProjects;