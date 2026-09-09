import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaList,
  FaChartBar,
  FaMapMarkedAlt,
  FaCog,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUsers,
  FaBuilding,
  FaFileAlt,
  FaArrowRight,
  FaDownload,
  FaEye,
  FaUserTie
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const GovernmentDashboard = () => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0,
    departments: 0,
    teams: 0,
    escalated: 0,
    underReview: 0,
  });

  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // GET GOVERNMENT DATA FROM DATABASE
  // ============================================
  useEffect(() => {
    fetchGovernmentData();
  }, []);

  const fetchGovernmentData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      // --------------------------------------------
      // FETCH DASHBOARD DATA
      // --------------------------------------------
      const dashboardResponse = await fetch(
        `${API_URL}/api/government/dashboard`,
        {
          method: 'GET',
          headers
        }
      );

      const dashboardData = await dashboardResponse.json();

      console.log(
        'Government dashboard response:',
        dashboardData
      );

      if (
        !dashboardResponse.ok ||
        !dashboardData.success
      ) {
        throw new Error(
          dashboardData.message ||
          'Failed to load government dashboard'
        );
      }

      const dashboard =
        dashboardData.data || {};

      // --------------------------------------------
      // FETCH GOVERNMENT STATISTICS
      // --------------------------------------------
      const statsResponse = await fetch(
        `${API_URL}/api/government/stats`,
        {
          method: 'GET',
          headers
        }
      );

      const statsData = await statsResponse.json();

      console.log(
        'Government stats response:',
        statsData
      );

      if (
        !statsResponse.ok ||
        !statsData.success
      ) {
        throw new Error(
          statsData.message ||
          'Failed to load government statistics'
        );
      }

      const governmentStats =
        statsData.data || {};

      const overview =
        governmentStats.overview || {};

      // --------------------------------------------
      // FETCH RECENT PROBLEMS
      // --------------------------------------------
      const problemsResponse = await fetch(
        `${API_URL}/api/government/problems?page=1&limit=5`,
        {
          method: 'GET',
          headers
        }
      );

      const problemsData =
        await problemsResponse.json();

      console.log(
        'Government problems response:',
        problemsData
      );

      if (
        !problemsResponse.ok ||
        !problemsData.success
      ) {
        throw new Error(
          problemsData.message ||
          'Failed to load recent problems'
        );
      }

      const problemsResult =
        problemsData.data || {};

      const problems =
        problemsResult.problems ||
        problemsResult.data ||
        problemsResult.items ||
        [];

      // --------------------------------------------
      // CALCULATE STATUS COUNTS
      // --------------------------------------------
      const allProblems = Array.isArray(problems)
        ? problems
        : [];

      const inProgress =
        allProblems.filter(
          (problem) =>
            problem.status === 'In Progress'
        ).length;

      const underReview =
        allProblems.filter(
          (problem) =>
            problem.status === 'Under Review'
        ).length;

      const pendingFromRecent =
        allProblems.filter(
          (problem) =>
            problem.status === 'Pending'
        ).length;

      // --------------------------------------------
      // DEPARTMENTS
      // --------------------------------------------
      const departmentStats =
        Array.isArray(dashboard.departmentStats)
          ? dashboard.departmentStats
          : [];

      // --------------------------------------------
      // SET REAL DATABASE VALUES
      // --------------------------------------------
      setStats({
        totalProblems: Number(
          overview.total || 0
        ),

        resolved: Number(
          overview.solved || 0
        ),

        inProgress:
          allProblems.length > 0
            ? inProgress
            : 0,

        pending:
          allProblems.length > 0
            ? pendingFromRecent
            : Number(overview.pending || 0),

        departments:
          departmentStats.length,

        teams: 0,

        // IMPORTANT:
        // Use the actual Escalated count
        // from the backend statistics.
        escalated: Number(
          overview.escalated || 0
        ),

        underReview
      });

      setRecentProblems(allProblems);

    } catch (error) {
      console.error(
        'Government dashboard loading error:',
        error
      );

      toast.error(
        error.message ||
        'Failed to load government dashboard'
      );

      setRecentProblems([]);

    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'Resolved':
        'bg-green-50 text-green-600 border-green-200',

      'Solved':
        'bg-green-50 text-green-600 border-green-200',

      'In Progress':
        'bg-yellow-50 text-yellow-600 border-yellow-200',

      'Pending':
        'bg-gray-50 text-gray-600 border-gray-200',

      'Under Review':
        'bg-blue-50 text-blue-600 border-blue-200',

      'Escalated':
        'bg-red-50 text-red-600 border-red-200',
    };

    return (
      map[status] ||
      'bg-gray-50 text-gray-600 border-gray-200'
    );
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="government" />

        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">

            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-400">
              Loading government dashboard...
            </p>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="government" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-1">

            <FaUserTie className="text-3xl md:text-4xl text-red-400" />

            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
              Government Dashboard
            </h1>

          </div>

          <p className="text-sm md:text-base text-gray-400">
            Monitor citizen problems across the state
          </p>
        </div>

        {/* ============================================
            MAIN STATISTICS
        ============================================ */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Total Problems
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">
              {stats.totalProblems}
            </p>

          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Resolved
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">
              {stats.resolved}
            </p>

          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              In Progress
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">
              {stats.inProgress}
            </p>

          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <p className="text-[10px] md:text-sm text-gray-400">
              Pending
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-500">
              {stats.pending}
            </p>

          </div>

        </div>

        {/* ============================================
            SECONDARY STATISTICS
        ============================================ */}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <div className="flex items-center gap-3">

              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-50 rounded-xl flex items-center justify-center">

                <FaBuilding className="text-purple-400 text-sm md:text-base" />

              </div>

              <div>

                <p className="text-[10px] md:text-sm text-gray-400">
                  Departments
                </p>

                <p className="text-lg md:text-xl lg:text-2xl font-bold text-purple-500">
                  {stats.departments}
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <div className="flex items-center gap-3">

              <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-50 rounded-xl flex items-center justify-center">

                <FaUsers className="text-orange-400 text-sm md:text-base" />

              </div>

              <div>

                <p className="text-[10px] md:text-sm text-gray-400">
                  Active Teams
                </p>

                <p className="text-lg md:text-xl lg:text-2xl font-bold text-orange-500">
                  {stats.teams}
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">

            <div className="flex items-center gap-3">

              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 rounded-xl flex items-center justify-center">

                <FaExclamationTriangle className="text-red-400 text-sm md:text-base" />

              </div>

              <div>

                <p className="text-[10px] md:text-sm text-gray-400">
                  Escalated
                </p>

                <p className="text-lg md:text-xl lg:text-2xl font-bold text-red-500">
                  {stats.escalated}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ============================================
            QUICK ACTIONS
        ============================================ */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">

          <Link
            to="/government/problems"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-[#FFCABE] transition-all flex items-center gap-3"
          >

            <div className="w-10 h-10 bg-[#FFF5F2] rounded-xl flex items-center justify-center">
              <FaList className="text-pink-400" />
            </div>

            <div>

              <p className="font-semibold text-gray-700 text-sm">
                View All Problems
              </p>

              <p className="text-xs text-gray-400">
                Monitor citizen complaints
              </p>

            </div>

          </Link>

          <Link
            to="/government/departments"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-3"
          >

            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FaBuilding className="text-purple-400" />
            </div>

            <div>

              <p className="font-semibold text-gray-700 text-sm">
                Departments
              </p>

              <p className="text-xs text-gray-400">
                {stats.departments} active departments
              </p>

            </div>

          </Link>

          <Link
            to="/government/cpgrams"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-red-200 transition-all flex items-center gap-3"
          >

            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <FaExclamationTriangle className="text-red-400" />
            </div>

            <div>

              <p className="font-semibold text-gray-700 text-sm">
                CPGRAMS
              </p>

              <p className="text-xs text-gray-400">
                {stats.escalated} escalated problems
              </p>

            </div>

          </Link>

        </div>

        {/* ============================================
            RECENT PROBLEMS
        ============================================ */}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">

          <div className="flex justify-between items-center mb-3 md:mb-4">

            <h2 className="text-base md:text-lg font-bold text-gray-700">
              Recent Problems
            </h2>

            <Link
              to="/government/problems"
              className="text-[#FFCABE] hover:text-pink-700 text-xs md:text-sm flex items-center"
            >
              View All
              <FaArrowRight className="ml-1" />
            </Link>

          </div>

          {recentProblems.length === 0 ? (

            <div className="text-center py-6 md:py-8 text-gray-400">

              <FaFileAlt className="text-3xl md:text-4xl text-gray-300 mx-auto mb-3" />

              <p className="text-sm md:text-base">
                No problems reported yet
              </p>

              <p className="text-xs md:text-sm text-gray-300 mt-1">
                Problems will appear here once citizens start reporting
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-white/50">

                  <tr>

                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">
                      Title
                    </th>

                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">
                      Department
                    </th>

                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">
                      Status
                    </th>

                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">
                      Date
                    </th>

                    <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-50">

                  {recentProblems.map((problem, index) => (

                    <tr
                      key={
                        problem._id ||
                        problem.id ||
                        `problem-${index}`
                      }
                      className="hover:bg-white/30 transition-colors"
                    >

                      <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-600">
                        {problem.title || 'Untitled Problem'}
                      </td>

                      <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-500">
                        {problem.assignedDepartment ||
                          problem.department ||
                          'Not assigned'}
                      </td>

                      <td className="px-3 md:px-4 py-2">

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border ${getStatusBadge(
                            problem.status
                          )}`}
                        >
                          {problem.status === 'Solved'
                            ? 'Resolved'
                            : problem.status || 'Pending'}
                        </span>

                      </td>

                      <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-400">
                        {problem.createdAt
                          ? new Date(
                              problem.createdAt
                            ).toLocaleDateString('en-IN')
                          : '—'}
                      </td>

                      <td className="px-3 md:px-4 py-2">

                        <Link
                          to={`/government/problems/${problem._id}`}
                          className="text-pink-400 hover:text-[#D4A09A] transition-colors"
                        >
                          <FaEye />
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default GovernmentDashboard;