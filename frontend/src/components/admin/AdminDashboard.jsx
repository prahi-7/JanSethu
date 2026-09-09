import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaList,
  FaUsers,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaArrowRight,
  FaCog
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    solved: 0,
    inProgress: 0,
    pending: 0,
    totalUsers: 0,
    universities: 0,
    industryPartners: 0,
    activeTeams: 0,
  });

  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        setError('Admin authentication token not found.');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Admin stats response:', response.data);

      // Backend uses formatResponse(),
      // so the actual statistics are inside response.data.data
      const result = response.data?.data || response.data;

      /*
       * Backend returns users.byRole as an array like:
       *
       * [
       *   { _id: "citizen", count: 6 },
       *   { _id: "student", count: 3 },
       *   { _id: "university", count: 2 },
       *   { _id: "industry", count: 1 }
       * ]
       *
       * This helper finds the count for a particular role.
       */
      const byRole = result.users?.byRole || [];

      const getRoleCount = (roleNames) => {
        const roles = Array.isArray(roleNames)
          ? roleNames
          : [roleNames];

        const found = byRole.find((item) =>
          roles.includes(String(item._id).toLowerCase())
        );

        return found?.count || 0;
      };

      /*
       * Build dashboard statistics.
       */
      const dashboardStats = {
        // Problems
        totalProblems:
          result.totalProblems ??
          result.problems?.total ??
          result.problemStats?.total ??
          0,

        solved:
          result.solved ??
          result.problems?.solved ??
          result.problemStats?.solved ??
          0,

        inProgress:
          result.inProgress ??
          result.problems?.inProgress ??
          result.problemStats?.inProgress ??
          0,

        pending:
          result.pending ??
          result.problems?.pending ??
          result.problemStats?.pending ??
          0,

        // Users
        totalUsers:
          result.totalUsers ??
          result.users?.total ??
          result.userStats?.total ??
          0,

        // Universities
        universities:
          result.universities ??
          result.users?.universities ??
          getRoleCount([
            'university',
            'university_admin'
          ]),

        // Industry partners
        industryPartners:
          result.industryPartners ??
          result.users?.industryPartners ??
          getRoleCount([
            'industry',
            'industry_partner'
          ]),

        // Teams
        activeTeams:
          result.activeTeams ??
          result.teams?.active ??
          result.teamStats?.active ??
          0,
      };

      console.log('Dashboard statistics:', dashboardStats);
      console.log('Users by role:', byRole);

      setStats(dashboardStats);

      /*
       * Recent problems
       */
      const problems =
        result.recentProblems ||
        result.recent?.problems ||
        result.problems?.recent ||
        [];

      setRecentProblems(
        Array.isArray(problems) ? problems : []
      );

    } catch (err) {
      console.error(
        'Failed to fetch admin dashboard data:',
        err
      );

      if (err.response?.status === 401) {
        setError(
          'Admin session expired. Please login again.'
        );
      } else if (err.response?.status === 403) {
        setError(
          'You do not have admin access.'
        );
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to load dashboard data.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="admin" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        {/* Header */}
        <div className="mb-4 md:mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Admin Dashboard
          </h1>

          <p className="text-sm md:text-base text-gray-400">
            Overview of the entire JanSethu platform
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Problem Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">

          {/* Total Problems */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Total Problems
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">
              {loading ? '...' : stats.totalProblems}
            </p>

          </div>

          {/* Solved */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Solved
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">
              {loading ? '...' : stats.solved}
            </p>

          </div>

          {/* In Progress */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              In Progress
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">
              {loading ? '...' : stats.inProgress}
            </p>

          </div>

          {/* Pending */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Pending
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-500">
              {loading ? '...' : stats.pending}
            </p>

          </div>

        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">

          {/* Total Users */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Total Users
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-500">
              {loading ? '...' : stats.totalUsers}
            </p>

          </div>

          {/* Universities */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Universities
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500">
              {loading ? '...' : stats.universities}
            </p>

          </div>

          {/* Industry Partners */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Industry Partners
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-500">
              {loading ? '...' : stats.industryPartners}
            </p>

          </div>

          {/* Active Teams */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Active Teams
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#FFCABE]">
              {loading ? '...' : stats.activeTeams}
            </p>

          </div>

        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">

          {/* Problems */}
          <Link
            to="/admin/problems"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-[#FFCABE] transition-all flex items-center gap-3"
          >

            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FFF5F2] rounded-xl flex items-center justify-center">

              <FaList className="text-pink-400 text-sm md:text-base" />

            </div>

            <div>

              <p className="font-semibold text-gray-700 text-xs md:text-sm">
                Problems
              </p>

              <p className="text-[10px] md:text-xs text-gray-400">
                Manage all problems
              </p>

            </div>

          </Link>

          {/* Users */}
          <Link
            to="/admin/users"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-3"
          >

            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-50 rounded-xl flex items-center justify-center">

              <FaUsers className="text-purple-400 text-sm md:text-base" />

            </div>

            <div>

              <p className="font-semibold text-gray-700 text-xs md:text-sm">
                Users
              </p>

              <p className="text-[10px] md:text-xs text-gray-400">
                Manage users
              </p>

            </div>

          </Link>

          {/* CPGRAMS */}
          <Link
            to="/admin/cpgrams"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-red-200 transition-all flex items-center gap-3"
          >

            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 rounded-xl flex items-center justify-center">

              <FaExternalLinkAlt className="text-red-400 text-sm md:text-base" />

            </div>

            <div>

              <p className="font-semibold text-gray-700 text-xs md:text-sm">
                CPGRAMS
              </p>

              <p className="text-[10px] md:text-xs text-gray-400">
                Escalate problems
              </p>

            </div>

          </Link>

          {/* Settings */}
          <Link
            to="/admin/settings"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-3"
          >

            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-xl flex items-center justify-center">

              <FaCog className="text-gray-400 text-sm md:text-base" />

            </div>

            <div>

              <p className="font-semibold text-gray-700 text-xs md:text-sm">
                Settings
              </p>

              <p className="text-[10px] md:text-xs text-gray-400">
                Admin settings
              </p>

            </div>

          </Link>

        </div>

        {/* Recent Problems */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">

          <div className="flex justify-between items-center mb-3 md:mb-4">

            <h2 className="text-base md:text-lg font-bold text-gray-700">
              Recent Problems
            </h2>

            <Link
              to="/admin/problems"
              className="text-[#FFCABE] hover:text-pink-700 text-xs md:text-sm flex items-center"
            >
              View All
              <FaArrowRight className="ml-1" />
            </Link>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="text-center py-8 text-gray-400">
              Loading problems...
            </div>

          ) : recentProblems.length === 0 ? (

            <div className="text-center py-6 md:py-8 text-gray-400">

              <FaCheckCircle className="text-3xl md:text-4xl text-gray-300 mx-auto mb-3" />

              <p className="text-sm md:text-base">
                No problems reported yet
              </p>

              <p className="text-xs md:text-sm text-gray-300 mt-1">
                Problems will appear here once citizens start reporting
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {recentProblems.map((problem, index) => (

                <div
                  key={problem._id || problem.id || index}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-100"
                >

                  <div>

                    <p className="font-semibold text-gray-700 text-sm">
                      {problem.title ||
                        problem.description ||
                        'Untitled Problem'}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {problem.category || 'General'} •{' '}
                      {problem.status || 'Pending'}
                    </p>

                  </div>

                  <Link
                    to="/admin/problems"
                    className="text-pink-400 text-xs hover:text-pink-600"
                  >
                    View
                  </Link>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;