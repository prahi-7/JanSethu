import React, { useEffect, useState } from 'react';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaSave
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';
import api from '../../services/api';

const STATUS_OPTIONS = [
  'Pending',
  'Under Review',
  'In Progress',
  'Solved',
  'Rejected',
  'Escalated'
];

const ManageProblems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await api.get(
        `/api/admin/problems?${params.toString()}`
      );

      if (response.data?.success) {
        const data = response.data.data;

        setProblems(
          data?.data ||
          data?.problems ||
          data?.results ||
          []
        );
      } else {
        setProblems([]);
      }

    } catch (error) {
      console.error('Fetch admin problems error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load problems'
      );

      setProblems([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProblems();
    }, 300);

    return () => clearTimeout(timer);
  }, [filterStatus, searchTerm]);

  // -----------------------------------------
  // UPDATE PROBLEM STATUS
  // -----------------------------------------
  const handleStatusChange = async (problemId, newStatus) => {
    if (!problemId || !newStatus) return;

    try {
      setUpdatingId(problemId);

      const response = await api.put(
        `/api/admin/problems/${problemId}/status`,
        {
          status: newStatus,
          comment: `Admin changed problem status to ${newStatus}`
        }
      );

      if (response.data?.success) {
        toast.success(
          `Status changed to ${newStatus}`
        );

        // Update the row immediately
        setProblems((currentProblems) =>
          currentProblems.map((problem) =>
            problem._id === problemId
              ? {
                  ...problem,
                  status: newStatus
                }
              : problem
          )
        );

      } else {
        toast.error(
          response.data?.message ||
          'Failed to update status'
        );
      }

    } catch (error) {
      console.error('Update status error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to update problem status'
      );

    } finally {
      setUpdatingId(null);
    }
  };

  // -----------------------------------------
  // DELETE PROBLEM
  // -----------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) {
      return;
    }

    try {
      await api.delete(`/api/admin/problems/${id}`);

      toast.success('Problem deleted successfully');

      fetchProblems();

    } catch (error) {
      console.error('Delete problem error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to delete problem'
      );
    }
  };

  // -----------------------------------------
  // STATUS BADGE
  // -----------------------------------------
  const getStatusBadge = (status) => {
    const map = {
      Solved: 'bg-green-50 text-green-600 border-green-200',
      'In Progress': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'Under Review': 'bg-blue-50 text-blue-600 border-blue-200',
      Pending: 'bg-gray-50 text-gray-600 border-gray-200',
      Rejected: 'bg-red-50 text-red-600 border-red-200',
      Escalated: 'bg-orange-50 text-orange-600 border-orange-200'
    };

    return (
      map[status] ||
      'bg-gray-50 text-gray-600 border-gray-200'
    );
  };

  const formatDate = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="admin" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        {/* Header */}
        <div className="mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Manage Problems
          </h1>

          <p className="text-sm md:text-base text-gray-400">
            View and manage all citizen-reported problems
          </p>

        </div>

        {/* Filters */}
        <div className="bg-white/80 rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">

          <div className="flex flex-col md:flex-row gap-3">

            {/* Search */}
            <div className="flex-1 relative">

              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">

              <FaFilter className="text-gray-400" />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="all">All Status</option>

                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center">

            <FaSpinner className="animate-spin text-4xl text-[#D4A09A] mx-auto mb-4" />

            <p className="text-gray-500">
              Loading problems...
            </p>

          </div>
        )}

        {/* Empty */}
        {!loading && problems.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">

            <FaExclamationTriangle className="text-5xl text-gray-300 mx-auto mb-4" />

            <p className="text-lg text-gray-500">
              No problems found
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Problems reported by citizens will appear here.
            </p>

          </div>
        )}

        {/* Table */}
        {!loading && problems.length > 0 && (
          <div className="bg-white/80 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-[#FFF5F2]">

                  <tr>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Problem
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Category
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Citizen
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Priority
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Reported
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {problems.map((problem) => (

                    <tr
                      key={problem._id || problem.id}
                      className="hover:bg-[#FFF5F2]/40"
                    >

                      {/* Problem */}
                      <td className="px-4 py-4">

                        <p className="font-semibold text-gray-700">
                          {problem.title}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          ID: {(problem._id || problem.id || '').slice(-8)}
                        </p>

                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {problem.category || '-'}
                      </td>

                      {/* Citizen */}
                      <td className="px-4 py-4 text-sm text-gray-500">

                        {problem.citizen?.name ||
                          problem.reportedBy?.name ||
                          problem.user?.name ||
                          '-'}

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">

                        <div className="flex flex-col gap-2">

                          {/* Current status badge */}
                          <span
                            className={`w-fit px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                              problem.status
                            )}`}
                          >
                            {problem.status || 'Pending'}
                          </span>

                          {/* Status dropdown */}
                          <select
                            value={problem.status || 'Pending'}
                            disabled={updatingId === problem._id}
                            onChange={(e) =>
                              handleStatusChange(
                                problem._id,
                                e.target.value
                              )
                            }
                            className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
                          >

                            {STATUS_OPTIONS.map((status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            ))}

                          </select>

                          {updatingId === problem._id && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">

                              <FaSpinner className="animate-spin" />

                              Updating...

                            </div>
                          )}

                        </div>

                      </td>

                      {/* Priority */}
                      <td className="px-4 py-4">

                        <span className="text-sm text-gray-500">
                          {problem.priority || '-'}
                        </span>

                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(problem.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">

                        <div className="flex gap-2">

                          <button
                            title="View"
                            onClick={() => {
                              window.location.href =
                                `/citizen/problem/${problem._id}`;
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          >
                            <FaEye />
                          </button>

                          <button
                            title="Delete"
                            onClick={() =>
                              handleDelete(problem._id)
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default ManageProblems;