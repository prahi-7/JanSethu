import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBuilding, 
  FaProjectDiagram, 
  FaUsers, 
  FaHandshake,
  FaDollarSign,
  FaUserTie,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaPlus,
  FaHeart
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const IndustryDashboard = () => {
  const [stats] = useState({
    projectsSupported: 0,
    teamsMentored: 0,
    solutionsDeployed: 0,
    fundedProjects: 0,
    availableProjects: 0,
  });

  const [recentActivities] = useState([]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="industry" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-1">
            <FaBuilding className="text-3xl md:text-4xl text-orange-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Industry Dashboard</h1>
          </div>
          <p className="text-sm md:text-base text-gray-400">Support student teams and deploy solutions</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Projects Supported</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">{stats.projectsSupported}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Teams Mentored</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-500">{stats.teamsMentored}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Solutions Deployed</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">{stats.solutionsDeployed}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Funded Projects</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500">{stats.fundedProjects}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          <Link to="/industry/projects" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md hover:border-[#FFCABE] transition-all">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FFF5F2] rounded-xl flex items-center justify-center">
                <FaProjectDiagram className="text-xl md:text-2xl text-pink-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm md:text-base">View Projects</p>
                <p className="text-xs md:text-sm text-gray-400">Browse available projects to support</p>
              </div>
            </div>
          </Link>
          <Link to="/industry/fund/1" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md hover:border-green-200 transition-all">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FaDollarSign className="text-xl md:text-2xl text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm md:text-base">Fund Projects</p>
                <p className="text-xs md:text-sm text-gray-400">Provide funding for promising solutions</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4">Recent Activity</h2>
          {recentActivities.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-400">
              <FaHeart className="text-3xl md:text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm md:text-base">No recent activity</p>
              <p className="text-xs md:text-sm text-gray-300 mt-1">Activities will appear here once you start supporting projects</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                  {/* Activity details */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryDashboard;