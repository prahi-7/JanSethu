import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaUser,
  FaCalendarAlt
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const UniversityTeams = () => {
  const { user } = useAuth();

  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/student/teams',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      console.log('📥 Teams data:', data);

      if (data.success) {
        const teamsList =
          data.data?.data ||
          data.data ||
          [];

        console.log('📋 Teams list:', teamsList);

        // IMPORTANT DEBUGGING
        teamsList.forEach((team) => {
          console.log('🔑 TEAM ID:', team?._id);
          console.log('📦 FULL TEAM:', team);
        });

        setTeams(teamsList);
        setFilteredTeams(teamsList);
      } else {
        toast.error(
          data.message || 'Failed to load teams'
        );
      }
    } catch (error) {
      console.error(
        '❌ Error fetching teams:',
        error
      );

      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  // Filter teams
  useEffect(() => {
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      const filtered = teams.filter((team) => {
        return (
          team.name
            ?.toLowerCase()
            .includes(search) ||
          team.university
            ?.toLowerCase()
            .includes(search)
        );
      });

      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams);
    }
  }, [searchTerm, teams]);

  // Loading screen
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="student" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                <FaUsers className="inline-block text-[#D4A09A] mr-2" />
                Teams
              </h1>

              <p className="text-gray-400 text-sm">
                Manage and join teams
              </p>
            </div>

            <Link
              to="/student/teams/create"
              className="mt-3 md:mt-0 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <FaPlus />
              Create Team
            </Link>

          </div>

          {/* Search */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">

            <div className="relative">

              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search teams by name or university..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
              />

            </div>

          </div>

          {/* No Teams */}
          {filteredTeams.length === 0 ? (

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-12 text-center">

              <div className="text-4xl mb-3">
                🤝
              </div>

              <p className="text-gray-500">
                No teams found
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {teams.length === 0
                  ? 'Create your first team'
                  : 'Try adjusting your search'}
              </p>

              {teams.length === 0 && (
                <Link
                  to="/student/teams/create"
                  className="inline-block mt-3 text-[#D4A09A] hover:text-[#8B5E5E]"
                >
                  Create a team →
                </Link>
              )}

            </div>

          ) : (

            /* Teams Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {filteredTeams.map((team, index) => {

                /*
                 * DEBUGGING:
                 * This tells us exactly what ID is being
                 * received from the backend.
                 */
                console.log(
                  `🔑 TEAM ${index + 1} ID:`,
                  team?._id
                );

                console.log(
                  `📦 TEAM ${index + 1}:`,
                  team
                );

                return (
                  <Link
                    key={team?._id || index}
                    to={`/student/teams/${team?._id}`}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-[#FFCABE]"
                  >

                    {/* Team Name + Status */}
                    <div className="flex items-start justify-between mb-2">

                      <h3 className="font-semibold text-gray-700">
                        {team?.name || 'Unnamed Team'}
                      </h3>

                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          team?.status === 'Active'
                            ? 'bg-green-50 text-green-600'
                            : team?.status === 'Forming'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {team?.status || 'Forming'}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {team?.description ||
                        'No description'}
                    </p>

                    {/* Team Information */}
                    <div className="flex items-center justify-between text-xs text-gray-400">

                      <span className="flex items-center gap-1">

                        <FaUser className="text-[#D4A09A]" />

                        {team?.members?.length || 0}
                        {' '}
                        members

                      </span>

                      <span className="flex items-center gap-1">

                        <FaCalendarAlt className="text-[#D4A09A]" />

                        {team?.createdAt
                          ? new Date(
                              team.createdAt
                            ).toLocaleDateString()
                          : 'N/A'}

                      </span>

                    </div>

                    {/* University */}
                    {team?.university && (
                      <p className="text-xs text-gray-400 mt-2">
                        {team.university}
                      </p>
                    )}

                  </Link>
                );
              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default UniversityTeams;