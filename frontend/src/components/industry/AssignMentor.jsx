import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaUserTie,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const AssignMentor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  // ============================================
  // LOAD PROJECT + MENTORS
  // ============================================
  useEffect(() => {
    console.log('🔥 AssignMentor projectId:', projectId);
    console.log(
      '🔥 AssignMentor projectId type:',
      typeof projectId
    );

    if (!projectId) {
      toast.error('Project ID is missing');
      setLoading(false);
      return;
    }

    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      // ==========================================
      // FETCH MENTORS
      // ==========================================
      const mentorsResponse = await fetch(
        `${API_URL}/api/industry/mentors`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const mentorsData = await mentorsResponse.json();

      console.log(
        '📥 Mentors response:',
        mentorsData
      );

      if (!mentorsResponse.ok || !mentorsData.success) {
        throw new Error(
          mentorsData.message ||
            'Failed to load mentors'
        );
      }

      const mentorList =
        mentorsData.data?.mentors ||
        mentorsData.data?.data ||
        mentorsData.data ||
        [];

      const validMentors = Array.isArray(mentorList)
        ? mentorList
        : [];

      console.log(
        '✅ Mentors loaded:',
        validMentors.length
      );

      setMentors(validMentors);

      // ==========================================
      // FETCH PROJECT
      // ==========================================
      const projectResponse = await fetch(
        `${API_URL}/api/industry/projects/${encodeURIComponent(
          projectId
        )}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const projectData =
        await projectResponse.json();

      console.log(
        '📥 Project response:',
        projectData
      );

      if (
        !projectResponse.ok ||
        !projectData.success
      ) {
        throw new Error(
          projectData.message ||
            'Failed to load project'
        );
      }

      const projectInfo =
        projectData.data?.project ||
        projectData.data?.data ||
        projectData.data;

      if (!projectInfo) {
        throw new Error(
          'Project data not found'
        );
      }

      setProject(projectInfo);

      // ==========================================
      // PRESELECT CURRENT MENTOR
      // ==========================================
      if (projectInfo.industryMentor) {
        let existingMentorId = null;

        if (
          typeof projectInfo.industryMentor ===
          'string'
        ) {
          existingMentorId =
            projectInfo.industryMentor;
        } else if (
          projectInfo.industryMentor._id
        ) {
          existingMentorId =
            projectInfo.industryMentor._id;
        }

        if (existingMentorId) {
          setSelectedMentor(
            String(existingMentorId)
          );
        }
      }

    } catch (error) {
      console.error(
        '❌ Assign Mentor loading error:',
        error
      );

      toast.error(
        error.message ||
          'Failed to load project'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ASSIGN MENTOR
  // ============================================
  const handleAssign = async (e) => {
    e.preventDefault();

    if (!projectId) {
      toast.error('Project ID is missing');
      return;
    }

    if (!selectedMentor) {
      toast.error('Please select a mentor');
      return;
    }

    const token = localStorage.getItem('jwt_token');

    if (!token) {
      toast.error('Please login again');
      navigate('/login');
      return;
    }

    try {
      setAssigning(true);

      console.log(
        '🚀 ASSIGN MENTOR'
      );

      console.log(
        'Project ID:',
        projectId
      );

      console.log(
        'Mentor ID:',
        selectedMentor
      );

      const url =
        `${API_URL}/api/industry/projects/` +
        `${encodeURIComponent(projectId)}/mentor`;

      console.log(
        '📤 PATCH URL:',
        url
      );

      const response = await fetch(
        url,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`
          },
          body: JSON.stringify({
            mentorId: selectedMentor
          })
        }
      );

      const data =
        await response.json();

      console.log(
        '📥 Assign mentor response:',
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            'Failed to assign mentor'
        );
      }

      toast.success(
        data.message ||
          'Mentor assigned successfully! 🎉'
      );

      // Navigate back to the same project
      navigate(
        `/industry/project/${encodeURIComponent(
          projectId
        )}`
      );

    } catch (error) {
      console.error(
        '❌ Assign mentor error:',
        error
      );

      toast.error(
        error.message ||
          'Failed to assign mentor'
      );
    } finally {
      setAssigning(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================
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

  // ============================================
  // MAIN PAGE
  // ============================================
  return (
    <div className="flex min-h-screen bg-[#FFF5F2] pt-16">
      <Sidebar role="industry" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <Link
          to={`/industry/project/${encodeURIComponent(
            projectId
          )}`}
          className="text-[#D4A09A] flex items-center mb-5 text-sm"
        >
          <FaArrowLeft className="mr-2" />
          Back to Project
        </Link>

        <div className="max-w-3xl mx-auto">

          <div className="flex items-center gap-3 mb-2">
            <FaUserTie className="text-3xl text-[#D4A09A]" />

            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
              Assign Mentor
            </h1>
          </div>

          <p className="text-gray-400 mb-6">
            Assign an industry mentor to support this student project.
          </p>

          {project && (
            <div className="bg-white rounded-2xl p-5 mb-5 border border-[#FFCABE]">

              <p className="text-xs text-gray-400">
                PROJECT
              </p>

              <h2 className="text-xl font-bold text-gray-700">
                {project.title}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {project.description}
              </p>

              {project.university && (
                <p className="text-xs text-gray-400 mt-2">
                  University: {project.university}
                </p>
              )}

            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-[#FFCABE] p-5">

            <form onSubmit={handleAssign}>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Select Industry Mentor
              </label>

              {mentors.length === 0 ? (

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
                  No mentors are currently available.
                </div>

              ) : (

                <div className="space-y-3">

                  {mentors.map((mentor) => {

                    const mentorId =
                      mentor?._id
                        ? String(mentor._id)
                        : null;

                    if (!mentorId) {
                      return null;
                    }

                    return (
                      <label
                        key={mentorId}
                        className={`block border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedMentor === mentorId
                            ? 'border-[#D4A09A] bg-[#FFF5F2]'
                            : 'border-gray-200 hover:border-[#FFCABE]'
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <input
                            type="radio"
                            name="mentor"
                            value={mentorId}
                            checked={
                              selectedMentor ===
                              mentorId
                            }
                            onChange={(e) =>
                              setSelectedMentor(
                                e.target.value
                              )
                            }
                          />

                          <div className="flex-1">

                            <div className="flex items-center gap-2">

                              <p className="font-semibold text-gray-700">
                                {mentor.name}
                              </p>

                              {selectedMentor ===
                                mentorId && (
                                <FaCheckCircle className="text-green-500" />
                              )}

                            </div>

                            {mentor.email && (
                              <p className="text-sm text-gray-400">
                                {mentor.email}
                              </p>
                            )}

                            {mentor.organization && (
                              <p className="text-sm text-gray-500 mt-1">
                                {mentor.organization}
                              </p>
                            )}

                            {Array.isArray(
                              mentor.expertise
                            ) &&
                              mentor.expertise.length >
                                0 && (
                                <div className="flex flex-wrap gap-1 mt-2">

                                  {mentor.expertise.map(
                                    (skill, index) => (
                                      <span
                                        key={index}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                      >
                                        {skill}
                                      </span>
                                    )
                                  )}

                                </div>
                              )}

                          </div>

                        </div>

                      </label>
                    );
                  })}

                </div>
              )}

              <button
                type="submit"
                disabled={
                  assigning ||
                  mentors.length === 0 ||
                  !selectedMentor
                }
                className="w-full mt-6 bg-[#FFCABE] text-[#8B5E5E] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >

                {assigning ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <FaUserTie />
                    Assign Mentor
                  </>
                )}

              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AssignMentor;