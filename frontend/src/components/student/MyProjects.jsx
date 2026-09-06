import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaArrowRight, FaProjectDiagram } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const MyProjects = () => {
  const [projects] = useState([]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">My Projects</h1>
        <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Track all your projects</p>

        {projects.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaProjectDiagram className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No projects yet</p>
            <Link to="/student/find-problems" className="inline-block mt-2 text-[#FFCABE] hover:text-pink-700 font-medium text-sm">
              Find problems to work on →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all">
                {/* Project details */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;