import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaHandshake,
  FaUsers,
  FaFilter,
  FaSearch,
  FaClock,
  FaDollarSign,
  FaTools,
  FaMapMarkerAlt
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const IndustryProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, filterCategory]);

  // ============================================
  // GET ALL PROJECTS
  // ============================================
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        throw new Error('Please login again');
      }

      const response = await fetch(
        `${API_URL}/api/industry/projects`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log(
        '🔥 INDUSTRY PROJECTS RAW RESPONSE:',
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to load projects'
        );
      }

      const projectList =
        data?.data?.projects ||
        data?.data?.data ||
        data?.data ||
        [];

      if (!Array.isArray(projectList)) {
        throw new Error(
          'Invalid projects data received from server'
        );
      }

      console.log(
        '🔥 INDUSTRY PROJECT LIST:',
        projectList
      );

      projectList.forEach((project, index) => {
        console.log(
          `🔥 PROJECT ${index + 1} TITLE:`,
          project?.title
        );

        console.log(
          `🔥 PROJECT ${index + 1} _id:`,
          project?._id
        );

        console.log(
          `🔥 PROJECT ${index + 1} id:`,
          project?.id
        );
      });

      setProjects(projectList);

    } catch (err) {
      console.error(
        '❌ Error fetching industry projects:',
        err
      );

      setError(
        err.message || 'Failed to load projects'
      );

      setProjects([]);

      toast.error(
        err.message || 'Failed to load projects'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FILTER PROJECTS
  // ============================================
  const filterProjects = () => {
    let filtered = [...projects];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      filtered = filtered.filter((project) =>
        project.title?.toLowerCase().includes(search) ||
        project.description?.toLowerCase().includes(search) ||
        project.category?.toLowerCase().includes(search) ||
        project.solutionType?.toLowerCase().includes(search)
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(
        (project) =>
          project.category?.toLowerCase() ===
          filterCategory.toLowerCase()
      );
    }

    setFilteredProjects(filtered);
  };

  // ============================================
  // SUPPORT
  // ============================================
  const handleSupport = (projectId) => {
    if (!projectId) {
      toast.error('Project ID is missing');
      return;
    }

    toast.success(
      'Support request sent successfully! 🎉'
    );
  };

  // ============================================
  // GET ONLY THE REAL MONGODB PROJECT ID
  // ============================================
  const getProjectId = (project) => {
    if (!project) {
      return null;
    }

    const mongoId = project._id;

    // Normal Mongoose JSON:
    // "_id": "68xxxxxxxxxxxxxxxxxxxxxxxx"
    if (typeof mongoId === 'string') {
      const trimmedId = mongoId.trim();

      // MongoDB ObjectId must be exactly 24 hex characters
      if (/^[a-fA-F0-9]{24}$/.test(trimmedId)) {
        return trimmedId;
      }

      console.error(
        '❌ Invalid MongoDB project _id:',
        mongoId
      );

      return null;
    }

    // MongoDB Extended JSON:
    // "_id": { "$oid": "68xxxxxxxxxxxxxxxxxxxxxxxx" }
    if (
      mongoId &&
      typeof mongoId === 'object' &&
      typeof mongoId.$oid === 'string'
    ) {
      const oid = mongoId.$oid.trim();

      if (/^[a-fA-F0-9]{24}$/.test(oid)) {
        return oid;
      }

      console.error(
        '❌ Invalid MongoDB $oid:',
        oid
      );

      return null;
    }

    console.error(
      '❌ Project does not contain a valid MongoDB _id:',
      project
    );

    return null;
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

        <Sidebar role="industry" />

        <div className="flex-1 p-8 ml-64 flex items-center justify-center">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-400">
              Loading projects...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ============================================
  // MAIN
  // ============================================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="industry" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        {/* Header */}
        <div className="mb-4 md:mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Available Projects
          </h1>

          <p className="text-sm md:text-base text-gray-400">
            Find projects that need your industry expertise and resources
          </p>

        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4 md:mb-6">

          <div className="flex flex-col md:flex-row gap-3 md:gap-4">

            {/* Search */}
            <div className="flex-1 relative">

              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              />

            </div>

            {/* Category */}
            <div className="flex items-center gap-2">

              <FaFilter className="text-gray-400" />

              <select
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value)
                }
                className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              >

                <option value="all">
                  All Categories
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4">
            {error}
          </div>
        )}

        {/* No Projects */}
        {projects.length === 0 ? (

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">

            <FaHandshake className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />

            <p className="text-base md:text-lg text-gray-500">
              No projects available
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Check back later for new projects
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {filteredProjects.map((project, index) => {

              const projectId =
                getProjectId(project);

              const teamName =
                typeof project.team === 'object'
                  ? project.team?.name
                  : project.team;

              const location =
                project.location ||
                project.university ||
                'Location not specified';

              const timeline =
                project.timeline ||
                'Timeline not specified';

              const budget =
                project.budget ||
                project.fundingAmount ||
                'Not specified';

              const resources =
                Array.isArray(
                  project.requiredResources
                )
                  ? project.requiredResources
                  : [];

              // ============================================
              // INVALID ID
              // ============================================
              if (!projectId) {
                return (
                  <div
                    key={
                      project?._id ||
                      `project-${index}`
                    }
                    className="bg-red-50 border border-red-200 rounded-2xl p-5"
                  >

                    <p className="font-semibold text-red-600">
                      Unable to open this project
                    </p>

                    <p className="text-sm text-red-500 mt-1">
                      This project does not have a valid MongoDB ID.
                    </p>

                  </div>
                );
              }

              return (
                <div
                  key={projectId}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all hover:border-[#FFCABE]"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 md:gap-4">

                    {/* Project Information */}
                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2 mb-2">

                        <h3 className="text-lg font-bold text-gray-700">
                          {project.title}
                        </h3>

                        <span className="px-2 py-0.5 bg-[#FFF5F2] text-[#D4A09A] rounded-full text-xs border border-[#FFCABE]">
                          {project.category ||
                            project.solutionType ||
                            'Project'}
                        </span>

                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full text-xs border border-yellow-200">
                          {project.status || 'Idea'}
                        </span>

                      </div>

                      <p className="text-sm text-gray-500 mb-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">

                        <span className="flex items-center gap-1">
                          <FaUsers />
                          {teamName || 'Team'}
                        </span>

                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt />
                          {location}
                        </span>

                        <span className="flex items-center gap-1">
                          <FaClock />
                          {timeline}
                        </span>

                        <span className="flex items-center gap-1">
                          <FaDollarSign />
                          {budget}
                        </span>

                      </div>

                      {/* Resources */}
                      <div className="mt-2">

                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Required Resources:
                        </p>

                        <div className="flex flex-wrap gap-1">

                          {resources.length > 0 ? (

                            resources.map(
                              (resource, idx) => (

                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-100 rounded-full text-xs flex items-center gap-1 text-gray-600"
                                >

                                  <FaTools className="text-gray-400 text-[10px]" />

                                  {resource}

                                </span>

                              )
                            )

                          ) : (

                            <span className="text-xs text-gray-400">
                              No specific resources listed
                            </span>

                          )}

                        </div>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">

                      <button
                        onClick={() =>
                          handleSupport(projectId)
                        }
                        className="bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <FaHandshake />
                        Offer Support
                      </button>

                      <Link
                        to={`/industry/project/${encodeURIComponent(projectId)}`}
                        className="border border-[#FFCABE] text-[#D4A09A] py-2 px-4 rounded-xl font-semibold hover:bg-[#FFF5F2] transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <FaEye />
                        View Details
                      </Link>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default IndustryProjects;