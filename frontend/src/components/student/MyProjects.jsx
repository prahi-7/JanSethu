import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaProjectDiagram,
  FaSpinner,
  FaPaperPlane
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('jwt_token');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const token = getToken();

      if (!token) {
        setError('Please login again.');
        return;
      }

      const response = await fetch(`${API_URL}/api/student/projects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load projects');
      }

      const projectList =
        data.data?.data ||
        data.data?.projects ||
        data.data ||
        [];

      setProjects(Array.isArray(projectList) ? projectList : []);
    } catch (err) {
      console.error('❌ Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (projectId) => {
    const confirmed = window.confirm(
      'Are you sure you want to submit this project for review?'
    );

    if (!confirmed) return;

    try {
      setSubmittingId(projectId);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/student/projects/${projectId}/submit`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit project');
      }

      alert('Project submitted successfully for review!');

      await fetchProjects();
    } catch (err) {
      console.error('❌ Submit project error:', err);
      alert(err.message || 'Failed to submit project');
    } finally {
      setSubmittingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';

      case 'Review':
        return 'bg-blue-100 text-blue-700';

      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
          My Projects
        </h1>

        <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">
          Track and submit your team projects
        </p>

        {loading ? (
          <div className="bg-white/80 rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <FaSpinner className="animate-spin text-4xl text-[#FFCABE] mx-auto mb-4" />
            <p className="text-gray-500">Loading your projects...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>

            <button
              onClick={fetchProjects}
              className="px-5 py-2 rounded-lg bg-[#FFCABE] text-gray-700 font-medium hover:bg-pink-200 transition"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaProjectDiagram className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />

            <p className="text-base md:text-lg text-gray-500">
              No projects yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Create a project with your team to see it here.
            </p>

            <Link
              to="/student/find-problems"
              className="inline-block mt-4 text-[#FFCABE] hover:text-pink-700 font-medium text-sm"
            >
              Find problems to work on →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  {/* Project information */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-pink-50 rounded-xl">
                        <FaProjectDiagram className="text-[#FFCABE] text-xl" />
                      </div>

                      <div>
                        <h2 className="text-lg md:text-xl font-semibold text-gray-700">
                          {project.title}
                        </h2>

                        {project.team?.name && (
                          <p className="text-sm text-gray-400 mt-1">
                            Team: {project.team.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                      {project.description || 'No project description available.'}
                    </p>

                    {project.problem?.title && (
                      <p className="text-sm text-gray-500 mt-3">
                        <span className="font-medium text-gray-600">
                          Problem:
                        </span>{' '}
                        {project.problem.title}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FaClock />
                        Progress: {project.progress || 0}%
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:min-w-[180px]">

                    <Link
                      to={`/student/project/${project._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                    >
                      View Project
                      <FaArrowRight />
                    </Link>

                    {project.status === 'Idea' ||
                    project.status === 'In Progress' ? (
                      <button
                        onClick={() => handleSubmit(project._id)}
                        disabled={submittingId === project._id}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#FFCABE] text-gray-700 hover:bg-pink-200 transition text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submittingId === project._id ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            Submit Project
                          </>
                        )}
                      </button>
                    ) : project.status === 'Review' ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium">
                        <FaClock />
                        Under Review
                      </div>
                    ) : project.status === 'Completed' ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-medium">
                        <FaCheckCircle />
                        Completed
                      </div>
                    ) : null}
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

export default MyProjects;