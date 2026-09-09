import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBriefcase,
  FaSpinner,
  FaPlus,
  FaEye
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const IndustryDashboard = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    funded: 0,
    inProgress: 0,
    completed: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      // Fetch REAL student projects
      const response = await fetch(
        'http://localhost:5000/api/industry/projects',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log('📥 Industry projects response:', data);

      if (!response.ok || !data.success) {
        toast.error(
          data.message || 'Failed to load projects'
        );
        return;
      }

      // Backend response:
      // data.data.projects
      const allProjects =
        data.data?.projects || [];

      console.log(
        '📋 Projects received:',
        allProjects
      );

      setProjects(allProjects);

      // Project statuses are:
      // Idea
      // In Progress
      // Review
      // Completed

      const calculatedStats = {
        total: allProjects.length,

        funded: allProjects.filter(
          project =>
            Number(project.fundingAmount || 0) > 0
        ).length,

        inProgress: allProjects.filter(
          project =>
            project.status === 'In Progress'
        ).length,

        completed: allProjects.filter(
          project =>
            project.status === 'Completed'
        ).length
      };

      setStats(calculatedStats);

    } catch (error) {
      console.error(
        '❌ Error fetching industry projects:',
        error
      );

      toast.error(
        'Failed to load projects'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="industry" />

        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-[#FFCABE]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="industry" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                <FaBriefcase className="inline-block text-[#D4A09A] mr-2" />
                Industry Dashboard
              </h1>

              <p className="text-gray-400 text-sm">
                Welcome back, {user?.name}!
              </p>
            </div>

            <Link
              to="/industry/projects"
              className="mt-3 md:mt-0 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <FaPlus />
              View Projects
            </Link>

          </div>


          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">

            {/* Total */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-400 text-sm">
                Total Projects
              </p>

              <p className="text-2xl font-bold text-gray-700">
                {stats.total}
              </p>
            </div>


            {/* Funded */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-100">
              <p className="text-green-500 text-sm">
                Funded
              </p>

              <p className="text-2xl font-bold text-green-500">
                {stats.funded}
              </p>
            </div>


            {/* In Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
              <p className="text-purple-500 text-sm">
                In Progress
              </p>

              <p className="text-2xl font-bold text-purple-500">
                {stats.inProgress}
              </p>
            </div>


            {/* Completed */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100">
              <p className="text-blue-500 text-sm">
                Completed
              </p>

              <p className="text-2xl font-bold text-blue-500">
                {stats.completed}
              </p>
            </div>

          </div>


          {/* Projects */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">

            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Available Student Projects
            </h2>

            {projects.length === 0 ? (

              <div className="text-center py-8">

                <div className="text-4xl mb-3">
                  📋
                </div>

                <p className="text-gray-400">
                  No projects available
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Check back later for new student projects
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {projects.map((project) => (

                  <div
                    key={project._id}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
                  >

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

                      <div className="flex-1">

                        <h3 className="font-semibold text-gray-700">
                          {project.title}
                        </h3>

                        <p className="text-sm text-gray-500 line-clamp-2">
                          {project.description}
                        </p>


                        {/* Project information */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">

                          {project.solutionType && (
                            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                              {project.solutionType}
                            </span>
                          )}

                          {project.team?.name && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              Team: {project.team.name}
                            </span>
                          )}

                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              project.status === 'Completed'
                                ? 'bg-green-50 text-green-600'
                                : project.status === 'In Progress'
                                ? 'bg-purple-50 text-purple-600'
                                : project.status === 'Review'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-yellow-50 text-yellow-600'
                            }`}
                          >
                            {project.status}
                          </span>

                          {Number(project.fundingAmount || 0) > 0 && (
                            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                              Funded ₹{Number(
                                project.fundingAmount
                              ).toLocaleString('en-IN')}
                            </span>
                          )}

                          {project.createdAt && (
                            <span className="text-xs text-gray-400">
                              {new Date(
                                project.createdAt
                              ).toLocaleDateString()}
                            </span>
                          )}

                        </div>

                      </div>


                      {/* View details */}
                      <Link
                        to={`/industry/project/${project._id}`}
                        className="text-[#D4A09A] hover:text-[#8B5E5E] text-sm flex items-center gap-1 whitespace-nowrap"
                      >
                        View Details
                        <FaEye />
                      </Link>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default IndustryDashboard;