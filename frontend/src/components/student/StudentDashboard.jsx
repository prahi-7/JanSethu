import React, { useEffect, useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import {
  FaHome,
  FaSearch,
  FaProjectDiagram,
  FaBook,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaComments,
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaHandshake,
  FaUniversity,
  FaUserGraduate,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaBell,
  FaSpinner
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const location = useLocation();
  const student = location.state?.student;

  const [stats] = useState({
    inProgress: 0,
    solved: 0,
    totalProjects: 0,
    teamMembers: 0,
  });

  const [inProgressProjects] = useState([]);
  const [solvedProjects] = useState([]);
  const [availableProblems] = useState([]);

  const [invitations, setInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const [respondingInvitation, setRespondingInvitation] = useState(null);

  if (!student) {
    return <Navigate to="/university/login" replace />;
  }

  // Get JWT token
  const getToken = () => {
    return localStorage.getItem('jwt_token');
  };

  // Fetch pending team invitations
  const fetchInvitations = async () => {
    try {
      setLoadingInvitations(true);

      const token = getToken();

      if (!token) {
        setLoadingInvitations(false);
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/student/team-invitations',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to fetch invitations'
        );
      }

      // Handle the existing formatResponse structure
      const invitationData =
        result?.data?.invitations ||
        result?.data ||
        [];

      setInvitations(
        Array.isArray(invitationData)
          ? invitationData
          : []
      );
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoadingInvitations(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // Accept invitation
  const handleAcceptInvitation = async (invitationId) => {
    try {
      setRespondingInvitation(invitationId);

      const token = getToken();

      const response = await fetch(
        `http://localhost:5000/api/student/team-invitations/${invitationId}/accept`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to accept invitation'
        );
      }

      toast.success('Team invitation accepted! 🎉');

      // Remove accepted invitation from pending list
      setInvitations((prev) =>
        prev.filter(
          (invitation) => invitation._id !== invitationId
        )
      );
    } catch (error) {
      console.error('Accept invitation error:', error);
      toast.error(
        error.message || 'Failed to accept invitation'
      );
    } finally {
      setRespondingInvitation(null);
    }
  };

  // Decline invitation
  const handleDeclineInvitation = async (invitationId) => {
    try {
      setRespondingInvitation(invitationId);

      const token = getToken();

      const response = await fetch(
        `http://localhost:5000/api/student/team-invitations/${invitationId}/decline`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to decline invitation'
        );
      }

      toast.success('Invitation declined.');

      // Remove declined invitation from pending list
      setInvitations((prev) =>
        prev.filter(
          (invitation) => invitation._id !== invitationId
        )
      );
    } catch (error) {
      console.error('Decline invitation error:', error);
      toast.error(
        error.message || 'Failed to decline invitation'
      );
    } finally {
      setRespondingInvitation(null);
    }
  };

  const handleFormTeam = () =>
    toast.success('Team formation request sent! 🎉');

  const handleChat = () =>
    toast.success('Opening chat... 💬');

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        {/* Back */}
        <Link
          to="/university/dashboard"
          className="inline-flex items-center gap-2 text-[#FFCABE] hover:text-pink-700 mb-3 md:mb-4 text-sm group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to University
        </Link>

        {/* Student Header */}
        <div className="bg-gradient-to-r from-[#FFCABE] via-[#E8B5A9] to-purple-500 rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">

            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold text-white border-4 border-white/50">
              {student.name?.charAt(0) || 'S'}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                {student.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 mt-1 md:mt-2 text-xs md:text-sm text-white/80">

                <span className="flex items-center gap-2">
                  <FaEnvelope /> {student.email}
                </span>

                <span className="flex items-center gap-2">
                  <FaIdCard /> Reg No: {student.regNo}
                </span>

                <span className="flex items-center gap-2">
                  <FaUniversity />
                  {student.university || 'University not provided'}
                </span>

                <span className="flex items-center gap-2">
                  <FaUserGraduate />
                  {student.department || 'Department not provided'}
                </span>

                <span className="flex items-center gap-2">
                  <FaClock />
                  {student.year || 'Year not provided'}
                </span>

              </div>
            </div>

            <div className="flex gap-2">

              <button
                onClick={handleFormTeam}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 text-sm md:text-base border border-white/30"
              >
                <FaUserPlus />
                Form Team
              </button>

              <Link
                to="/student/teams"
                className="px-3 md:px-4 py-1.5 md:py-2 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 text-sm md:text-base border border-white/30"
              >
                <FaUsers />
                Teams
              </Link>

            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">
              In Progress
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">
              {stats.inProgress}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">
              Solved
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">
              {stats.solved}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">
              Total Projects
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">
              {stats.totalProjects}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">
              Team Members
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-500">
              {stats.teamMembers}
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">

          <Link
            to="/student/find-problems"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-[#FFCABE] transition-all text-center"
          >
            <FaSearch className="text-xl md:text-2xl text-pink-400 mx-auto mb-1" />
            <p className="text-[10px] md:text-sm font-semibold text-gray-600">
              Find Problems
            </p>
          </Link>

          <Link
            to="/student/teams"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-green-200 transition-all text-center"
          >
            <FaUsers className="text-xl md:text-2xl text-green-400 mx-auto mb-1" />
            <p className="text-[10px] md:text-sm font-semibold text-gray-600">
              My Teams
            </p>
          </Link>

          <Link
            to="/student/teams"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-purple-200 transition-all text-center"
          >
            <FaComments className="text-xl md:text-2xl text-purple-400 mx-auto mb-1" />
            <p className="text-[10px] md:text-sm font-semibold text-gray-600">
              Team Chat
            </p>
          </Link>

          <Link
            to="/student/solution-library"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-orange-200 transition-all text-center"
          >
            <FaBook className="text-xl md:text-2xl text-orange-400 mx-auto mb-1" />
            <p className="text-[10px] md:text-sm font-semibold text-gray-600">
              Solution Library
            </p>
          </Link>

        </div>

        {/* =====================================================
            TEAM INVITATIONS
        ====================================================== */}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-4 md:mb-6">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-base md:text-lg font-bold text-gray-700 flex items-center gap-2">
              <FaBell className="text-[#FFCABE]" />
              Team Invitations

              {invitations.length > 0 && (
                <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded-full">
                  {invitations.length}
                </span>
              )}
            </h2>

          </div>

          {/* Loading */}
          {loadingInvitations ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <FaSpinner className="animate-spin mr-2" />
              Loading invitations...
            </div>
          ) : invitations.length === 0 ? (

            /* No Invitations */
            <div className="text-center py-6">

              <FaBell className="text-3xl text-gray-200 mx-auto mb-2" />

              <p className="text-sm text-gray-400">
                No pending team invitations
              </p>

            </div>

          ) : (

            /* Invitations */
            <div className="space-y-3">

              {invitations.map((invitation) => {

                const sender = invitation.sender || {};
                const team = invitation.team || {};
                const problem = invitation.problem || {};

                return (
                  <div
                    key={invitation._id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-white"
                  >

                    <div className="flex flex-col md:flex-row md:items-center gap-4">

                      {/* Invitation Info */}
                      <div className="flex-1">

                        <div className="flex items-start gap-3">

                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFCABE] to-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {sender.name?.charAt(0) || 'S'}
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-gray-700">
                              {sender.name || 'A student'} invited you
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Team:{' '}
                              <span className="font-semibold text-gray-700">
                                {team.name || 'Team'}
                              </span>
                            </p>

                            <p className="text-sm text-gray-500">
                              Problem:{' '}
                              <span className="font-semibold text-gray-700">
                                {problem.title || 'Problem'}
                              </span>
                            </p>

                          </div>

                        </div>

                        {/* Match Details */}
                        <div className="mt-3 flex flex-wrap gap-2">

                          <span className="text-xs font-semibold bg-green-50 text-green-600 px-3 py-1 rounded-full">
                            AI Match: {Math.round(Number(invitation.matchScore) || 0)}%
                          </span>

                          {Array.isArray(invitation.matchedSkills) &&
                            invitation.matchedSkills.length > 0 && (
                              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                                Skills: {invitation.matchedSkills.join(', ')}
                              </span>
                            )}

                        </div>

                        {invitation.reason && (
                          <div className="mt-3 bg-[#FFF5F2] rounded-lg p-3">

                            <p className="text-xs text-gray-400 mb-1">
                              Why you were recommended
                            </p>

                            <p className="text-sm text-gray-600">
                              {invitation.reason}
                            </p>

                          </div>
                        )}

                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2 md:min-w-[130px]">

                        <button
                          onClick={() =>
                            handleAcceptInvitation(invitation._id)
                          }
                          disabled={
                            respondingInvitation === invitation._id
                          }
                          className="flex-1 md:w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >

                          {respondingInvitation === invitation._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaCheck />
                          )}

                          Accept

                        </button>

                        <button
                          onClick={() =>
                            handleDeclineInvitation(invitation._id)
                          }
                          disabled={
                            respondingInvitation === invitation._id
                          }
                          className="flex-1 md:w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <FaTimes />
                          Decline
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Existing Project Section */}
        {inProgressProjects.length === 0 &&
        solvedProjects.length === 0 &&
        availableProblems.length === 0 ? (

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center">

            <FaProjectDiagram className="text-4xl md:text-6xl text-gray-300 mx-auto mb-3 md:mb-4" />

            <p className="text-base md:text-lg text-gray-500">
              No projects assigned yet
            </p>

            <Link
              to="/student/find-problems"
              className="inline-block mt-2 md:mt-3 text-[#FFCABE] hover:text-pink-700 text-sm md:text-base"
            >
              Find problems to solve →
            </Link>

          </div>

        ) : (

          <>

            <div className="mb-4 md:mb-6">

              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaClock className="text-yellow-500" />
                In Progress ({inProgressProjects.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

                {inProgressProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all border-l-4 border-l-yellow-400"
                  >
                    {/* Project details */}
                  </div>
                ))}

              </div>

            </div>

            <div className="mb-4 md:mb-6">

              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Solved ({solvedProjects.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

                {solvedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all border-l-4 border-l-green-400"
                  >
                    {/* Project details */}
                  </div>
                ))}

              </div>

            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">

              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaHandshake className="text-[#FFCABE]" />
                Available to Accept
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

                {availableProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="border border-gray-200 rounded-xl p-3 md:p-4 hover:shadow-md transition-all hover:border-[#FFCABE]"
                  >
                    {/* Problem details */}
                  </div>
                ))}

              </div>

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;