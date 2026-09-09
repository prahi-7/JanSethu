import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaUserTie,
  FaCoins,
  FaSpinner,
  FaUsers,
  FaFile
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const IndustryProjectDetail = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('Project ID is missing');
      setLoading(false);
      return;
    }

    console.log('🔥 PROJECT DETAIL URL ID:', id);

    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/industry/projects/${encodeURIComponent(id)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log('🔥 PROJECT DETAIL RESPONSE:', data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to load project'
        );
      }

      const projectData =
        data.data?.project ||
        data.data?.data ||
        data.data;

      if (!projectData) {
        throw new Error('Project data not found');
      }

      console.log('🔥 ACTUAL MONGODB PROJECT:', projectData);
      console.log('🔥 ACTUAL MONGODB PROJECT _id:', projectData._id);

      setProject(projectData);

    } catch (error) {
      console.error('❌ PROJECT DETAIL ERROR:', error);

      toast.error(
        error.message || 'Failed to load project'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // GET ACTUAL MONGODB PROJECT ID
  // --------------------------------------------------
  const getProjectId = () => {
    if (!project?._id) {
      return null;
    }

    if (typeof project._id === 'string') {
      return project._id;
    }

    if (project._id?.$oid) {
      return project._id.$oid;
    }

    if (project._id?.toString) {
      return project._id.toString();
    }

    return null;
  };

  const projectId = getProjectId();

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FFF5F2] pt-16">
        <Sidebar role="industry" />

        <div className="flex-1 ml-64 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-[#FFCABE]" />
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PROJECT NOT FOUND
  // --------------------------------------------------
  if (!project) {
    return (
      <div className="flex min-h-screen bg-[#FFF5F2] pt-16">
        <Sidebar role="industry" />

        <div className="flex-1 ml-64 p-8">

          <Link
            to="/industry/projects"
            className="text-[#D4A09A] flex items-center mb-5 text-sm"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </Link>

          <p className="text-gray-500">
            Project not found.
          </p>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // INVALID PROJECT ID
  // --------------------------------------------------
  if (!projectId) {
    return (
      <div className="flex min-h-screen bg-[#FFF5F2] pt-16">
        <Sidebar role="industry" />

        <div className="flex-1 ml-64 p-8">

          <Link
            to="/industry/projects"
            className="text-[#D4A09A] flex items-center mb-5 text-sm"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </Link>

          <p className="text-red-500">
            Invalid project ID.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFF5F2] pt-16">

      <Sidebar role="industry" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <Link
          to="/industry/dashboard"
          className="text-[#D4A09A] flex items-center mb-5 text-sm"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <div className="bg-white rounded-2xl p-6 border border-[#FFCABE]">

            <div className="flex flex-col md:flex-row justify-between gap-4">

              <div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                  {project.title}
                </h1>

                <p className="text-gray-500 mt-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">

                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">
                    {project.solutionType || 'Software'}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm">
                    {project.status}
                  </span>

                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-2">

                <Link
                  to={`/industry/assign-mentor/${encodeURIComponent(projectId)}`}
                  className="bg-[#FFCABE] text-[#8B5E5E] px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <FaUserTie />
                  Assign Mentor
                </Link>

                <Link
                  to={`/industry/fund/${encodeURIComponent(projectId)}`}
                  className="bg-green-100 text-green-700 px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <FaCoins />
                  Fund Project
                </Link>

              </div>

            </div>

          </div>

          {/* PROJECT INFORMATION + TEAM */}
          <div className="grid md:grid-cols-2 gap-5 mt-5">

            {/* Project Information */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">

              <h2 className="font-semibold text-gray-700 mb-4">
                Project Information
              </h2>

              <div className="space-y-3 text-sm">

                <p>
                  <span className="text-gray-400">
                    University:
                  </span>{' '}
                  {project.university || 'Not specified'}
                </p>

                <p>
                  <span className="text-gray-400">
                    Solution Type:
                  </span>{' '}
                  {project.solutionType || 'Software'}
                </p>

                <p>
                  <span className="text-gray-400">
                    Progress:
                  </span>{' '}
                  {project.progress || 0}%
                </p>

                {project.industryMentor && (
                  <p>
                    <span className="text-gray-400">
                      Mentor:
                    </span>{' '}
                    {project.industryMentor.name}
                  </p>
                )}

                {Number(project.fundingAmount || 0) > 0 && (
                  <p className="text-green-600 font-semibold">
                    Funding: ₹
                    {Number(project.fundingAmount).toLocaleString('en-IN')}
                  </p>
                )}

              </div>

            </div>

            {/* Team */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">

              <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaUsers />
                Student Team
              </h2>

              {project.team ? (

                <div>

                  <p className="font-medium text-gray-700">
                    {project.team.name}
                  </p>

                  {project.team.members?.length > 0 && (
                    <div className="mt-3 space-y-2">

                      {project.team.members.map((member) => (

                        <div
                          key={member._id}
                          className="text-sm text-gray-500"
                        >
                          {member.name}
                          {member.email &&
                            ` — ${member.email}`}
                        </div>

                      ))}

                    </div>
                  )}

                </div>

              ) : (
                <p className="text-gray-400">
                  Team information unavailable.
                </p>
              )}

            </div>

          </div>

          {/* UPLOADED FILES */}
          {project.files?.length > 0 && (

            <div className="bg-white rounded-2xl p-5 mt-5 border border-gray-100">

              <h2 className="font-semibold text-gray-700 mb-4">
                Project Files
              </h2>

              <div className="space-y-2">

                {project.files.map((file, index) => (

                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#FFF5F2]"
                  >

                    <FaFile className="text-[#D4A09A]" />

                    <span className="text-sm text-gray-600">
                      {file.name}
                    </span>

                  </a>

                ))}

              </div>

            </div>
          )}

          {/* RELATED CITIZEN PROBLEM */}
          {project.problem && (

            <div className="bg-white rounded-2xl p-5 mt-5 border border-gray-100">

              <h2 className="font-semibold text-gray-700 mb-2">
                Related Citizen Problem
              </h2>

              <p className="font-medium text-gray-700">
                {project.problem.title}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {project.problem.description}
              </p>

              <Link
                to={`/industry/problem/${project.problem._id}`}
                className="inline-block mt-3 text-[#D4A09A] text-sm font-medium"
              >
                View Problem →
              </Link>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default IndustryProjectDetail;