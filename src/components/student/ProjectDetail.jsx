import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaClock, FaCheckCircle, FaComments, FaArrowRight } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const ProjectDetail = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <Link to="/student/my-projects" className="text-[#FFCABE] hover:text-pink-700 flex items-center mb-4 text-sm group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-700">Project Title</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Project description goes here...</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-6">
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs border border-yellow-200 inline-block mt-1">In Progress</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Progress</p>
              <p className="font-semibold text-gray-700 text-sm">60%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Deadline</p>
              <p className="font-semibold text-gray-700 text-sm">2024-03-15</p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FaUsers className="text-pink-400" /> Team</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#FFF5F2] text-[#D4A09A] rounded-full text-xs border border-[#FFCABE]">Member 1</span>
              <span className="px-3 py-1 bg-[#FFF5F2] text-[#D4A09A] rounded-full text-xs border border-[#FFCABE]">Member 2</span>
              <span className="px-3 py-1 bg-[#FFF5F2] text-[#D4A09A] rounded-full text-xs border border-[#FFCABE]">Member 3</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Mentor: Dr. Suresh Reddy</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-[#FFF5F2] text-[#D4A09A] rounded-xl font-semibold hover:bg-pink-100 transition-all flex items-center gap-2 text-sm border border-[#FFCABE]">
              <FaComments /> Chat with Team
            </button>
            <button className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold hover:bg-green-100 transition-all flex items-center gap-2 text-sm border border-green-200">
              <FaCheckCircle /> Submit Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;