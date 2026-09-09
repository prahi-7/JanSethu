import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaBuilding
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const GovernmentProblemDetail = () => {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/government/problems/${encodeURIComponent(id)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log(
        'Government problem detail response:',
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to load problem'
        );
      }

      const problemData =
        data.data?.problem ||
        data.data?.data ||
        data.data;

      setProblem(problemData);

    } catch (error) {
      console.error(
        'Error loading government problem:',
        error
      );

      toast.error(
        error.message || 'Failed to load problem'
      );

    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      Pending:
        'bg-gray-50 text-gray-600 border-gray-200',

      'Under Review':
        'bg-blue-50 text-blue-600 border-blue-200',

      'In Progress':
        'bg-yellow-50 text-yellow-600 border-yellow-200',

      Solved:
        'bg-green-50 text-green-600 border-green-200',

      Escalated:
        'bg-red-50 text-red-600 border-red-200',

      Rejected:
        'bg-gray-50 text-gray-600 border-gray-200'
    };

    return (
      classes[status] ||
      'bg-gray-50 text-gray-600 border-gray-200'
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="government" />

        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-400">
              Loading problem...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="government" />

        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
          <Link
            to="/government/dashboard"
            className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-600 mb-6"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <FaExclamationTriangle className="text-4xl text-red-300 mx-auto mb-3" />

            <h2 className="text-xl font-bold text-gray-700">
              Problem Not Found
            </h2>

            <p className="text-gray-400 mt-2">
              The requested problem could not be found.
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

        <Link
          to="/government/dashboard"
          className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-600 mb-6"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                {problem.title || 'Untitled Problem'}
              </h1>

              <p className="text-sm text-gray-400 mt-2">
                Problem ID: {problem._id}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusClass(
                problem.status
              )}`}
            >
              {problem.status || 'Pending'}
            </span>

          </div>

          {problem.priority && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-semibold">
                <FaExclamationTriangle />
                Priority: {problem.priority}
              </span>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              Description
            </h2>

            <p className="text-gray-500 leading-relaxed">
              {problem.description || 'No description available.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FaBuilding className="text-purple-400" />

                <div>
                  <p className="text-xs text-gray-400">
                    Department
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    {problem.assignedDepartment ||
                      problem.department ||
                      'Not assigned'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FaUser className="text-blue-400" />

                <div>
                  <p className="text-xs text-gray-400">
                    Citizen
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    {problem.citizen?.name ||
                      problem.citizen?.email ||
                      'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-green-400" />

                <div>
                  <p className="text-xs text-gray-400">
                    Reported Date
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    {problem.createdAt
                      ? new Date(
                          problem.createdAt
                        ).toLocaleDateString('en-IN')
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-red-400" />

                <div>
                  <p className="text-xs text-gray-400">
                    Location
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    {problem.location?.address ||
                      problem.address ||
                      'Location not available'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {problem.assignedTo && (
            <div className="mt-6 bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">
                Assigned Officer
              </p>

              <p className="text-sm font-semibold text-gray-700">
                {problem.assignedTo.name ||
                  problem.assignedTo.email ||
                  'Assigned'}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default GovernmentProblemDetail;