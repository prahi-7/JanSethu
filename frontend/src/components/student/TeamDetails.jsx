import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaUsers,
  FaUserPlus,
  FaUserMinus,
  FaSpinner,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaComments,
  FaProjectDiagram
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TeamDetail = () => {
  const { teamId } = useParams();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      console.log('🔍 Loading team ID:', teamId);

      const response = await fetch(
        `http://localhost:5000/api/student/teams/${encodeURIComponent(teamId)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      console.log('📥 Team details response:', data);

      if (data.success) {
        const teamData =
          data.data?.team ||
          data.data?.data ||
          data.data;

        console.log('✅ Team data:', teamData);

        setTeam(teamData);
        setMembers(teamData?.members || []);

        const leaderId =
          typeof teamData?.leader === 'object'
            ? teamData.leader?._id || teamData.leader?.id
            : teamData?.leader;

        setIsLeader(
          leaderId?.toString() ===
          (user?._id || user?.id)?.toString()
        );
      } else {
        toast.error(data.message || 'Failed to load team');
      }
    } catch (error) {
      console.error('❌ Error fetching team:', error);
      toast.error('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    try {
      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/student/teams/${encodeURIComponent(teamId)}/join`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Joined team successfully!');
        fetchTeamDetails();
      } else {
        toast.error(data.message || 'Failed to join team');
      }
    } catch (error) {
      console.error('❌ Error joining team:', error);
      toast.error('Failed to join team');
    }
  };

  const handleLeaveTeam = async () => {
    try {
      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/student/teams/${encodeURIComponent(teamId)}/leave`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Left team');
        fetchTeamDetails();
      } else {
        toast.error(data.message || 'Failed to leave team');
      }
    } catch (error) {
      console.error('❌ Error leaving team:', error);
      toast.error('Failed to leave team');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="student" />

        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-[#FFCABE]" />
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="student" />

        <div className="flex-1 p-8 ml-64">
          <p className="text-center text-gray-500 mb-4">
            Team not found
          </p>

          <Link
            to="/student/teams"
            className="text-[#D4A09A] hover:text-[#8B5E5E]"
          >
            ← Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const currentUserId =
    user?._id?.toString() ||
    user?.id?.toString();

  const getMemberId = (member) => {
    if (!member) return null;

    if (typeof member === 'object') {
      return (
        member?._id?.toString() ||
        member?.id?.toString()
      );
    }

    return member?.toString();
  };

  const leaderId =
    typeof team.leader === 'object'
      ? (
          team.leader?._id?.toString() ||
          team.leader?.id?.toString()
        )
      : team.leader?.toString();

  const isMember =
    members.some(
      (member) => getMemberId(member) === currentUserId
    ) || leaderId === currentUserId;

  console.log('👤 Current user ID:', currentUserId);
  console.log('👥 Team members:', members);
  console.log('👑 Leader ID:', leaderId);
  console.log('✅ Is member:', isMember);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">

          {/* Top Navigation */}
          <div className="flex flex-wrap items-center gap-3 mb-6">

            <Link
              to="/student/teams"
              className="text-[#D4A09A] hover:text-[#8B5E5E] flex items-center gap-2"
            >
              <FaArrowLeft />
              Back to Teams
            </Link>

            {/* Team Chat */}
            {isMember && (
              <Link
                to={`/student/chat/${teamId}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A09A] text-white rounded-lg hover:bg-[#8B5E5E] transition"
              >
                <FaComments />
                Open Team Chat
              </Link>
            )}

            {/* Create Project */}
            {isMember && (
              <Link
                to={`/student/create-project?teamId=${teamId}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFCABE] text-gray-700 rounded-lg hover:bg-pink-200 transition"
              >
                <FaProjectDiagram />
                Create Project
              </Link>
            )}
          </div>

          {/* Main Team Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* Team Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

              <div>
                <h1 className="text-2xl font-bold text-gray-700">
                  {team.name}
                </h1>

                {team.project && (
                  <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                    <FaProjectDiagram />
                    Project Team
                  </p>
                )}
              </div>

              <span
                className={`self-start px-3 py-1 rounded-full text-sm ${
                  team.status === 'Active'
                    ? 'bg-green-50 text-green-600'
                    : team.status === 'Forming'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-gray-50 text-gray-600'
                }`}
              >
                {team.status || 'Forming'}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-500 mb-6">
              {team.description || 'No description'}
            </p>

            {/* Team Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">
                  Members
                </p>

                <p className="text-xl font-semibold text-gray-700">
                  {members.length}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <FaCalendarAlt />
                  Created
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {team.createdAt
                    ? new Date(team.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">
                  University
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {team.university || 'N/A'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">
                  Maximum Members
                </p>

                <p className="text-xl font-semibold text-gray-700">
                  {team.maxMembers || 6}
                </p>
              </div>

            </div>

            {/* Team Actions */}
            <div className="flex flex-wrap gap-3 mb-8">

              {/* Join */}
              {!isMember &&
                members.length < (team.maxMembers || 6) && (
                  <button
                    onClick={handleJoinTeam}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <FaUserPlus />
                    Join Team
                  </button>
                )}

              {/* Team Full */}
              {!isMember &&
                members.length >= (team.maxMembers || 6) && (
                  <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
                    Team is Full
                  </span>
                )}

              {/* Leave */}
              {isMember && !isLeader && (
                <button
                  onClick={handleLeaveTeam}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <FaUserMinus />
                  Leave Team
                </button>
              )}

              {/* Team Chat */}
              {isMember && (
                <Link
                  to={`/student/chat/${teamId}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  <FaComments />
                  Team Chat
                </Link>
              )}

              {/* Create Project */}
              {isMember && (
                <Link
                  to={`/student/create-project?teamId=${teamId}`}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition"
                >
                  <FaProjectDiagram />
                  Create Project
                </Link>
              )}

            </div>

            {/* Members Section */}
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUsers className="text-[#D4A09A]" />
              Members ({members.length})
            </h2>

            {members.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No members yet
              </p>
            ) : (
              <div className="space-y-2">

                {members.map((member, index) => {

                  const memberId = getMemberId(member);

                  const isMemberLeader =
                    memberId === leaderId;

                  return (
                    <div
                      key={memberId || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 bg-[#FFF5F2] rounded-full flex items-center justify-center text-[#D4A09A]">
                          <FaUser />
                        </div>

                        <div>
                          <p className="font-medium text-gray-700">
                            {typeof member === 'object'
                              ? member?.name || 'Unknown Member'
                              : 'Team Member'}
                          </p>

                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FaEnvelope />

                            {typeof member === 'object'
                              ? member?.email || 'No email'
                              : ''}
                          </p>
                        </div>

                      </div>

                      {isMemberLeader && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          Leader
                        </span>
                      )}

                    </div>
                  );
                })}

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;