import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaSpinner
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FindProblems = () => {
  const { user } = useAuth();

  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: ''
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      /*
       * Fetch all active citizen problems.
       *
       * We intentionally do NOT send:
       * ?status=Pending,Under Review,In Progress
       *
       * because the backend already returns active problems
       * when no status parameter is provided.
       */
      const response = await fetch(
        'http://localhost:5000/api/problems',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log('📥 Problems fetched:', data);

      if (data.success) {
        const allProblems =
          data.data?.data ||
          data.data ||
          [];

        setProblems(allProblems);
        setFilteredProblems(allProblems);
      } else {
        toast.error(
          data.message || 'Failed to load problems'
        );
      }

    } catch (error) {
      console.error(
        '❌ Error fetching problems:',
        error
      );

      toast.error('Failed to load problems');

    } finally {
      setLoading(false);
    }
  };


  // Apply search and filters
  useEffect(() => {
    let filtered = [...problems];

    // Search
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      filtered = filtered.filter((problem) =>
        problem.title
          ?.toLowerCase()
          .includes(search) ||

        problem.description
          ?.toLowerCase()
          .includes(search) ||

        problem.category
          ?.toLowerCase()
          .includes(search)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (problem) =>
          problem.category === filters.category
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (problem) =>
          problem.status === filters.status
      );
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(
        (problem) =>
          problem.priority === filters.priority
      );
    }

    setFilteredProblems(filtered);

  }, [
    searchTerm,
    filters,
    problems
  ]);


  const categories = [
    'All',
    'Roads',
    'Water',
    'Electricity',
    'Sanitation',
    'Healthcare',
    'Education',
    'Transport',
    'Housing',
    'Environment',
    'Other'
  ];

  const statuses = [
    'All',
    'Pending',
    'Under Review',
    'In Progress'
  ];

  const priorities = [
    'All',
    'Low',
    'Medium',
    'High',
    'Urgent'
  ];


  const clearFilters = () => {
    setSearchTerm('');

    setFilters({
      category: '',
      status: '',
      priority: ''
    });
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


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="student" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
            Find Problems
          </h1>

          <p className="text-sm text-gray-400 mb-6">
            Discover community problems you can help solve
          </p>


          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">

              <div className="flex-1 relative">

                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search problems by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
                />

              </div>

            </div>


            {/* Filters */}
            <div className="flex flex-wrap gap-3 mt-3">

              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value
                  }))
                }
                className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
              >

                {categories.map((category) => (

                  <option
                    key={category}
                    value={
                      category === 'All'
                        ? ''
                        : category
                    }
                  >
                    {category}
                  </option>

                ))}

              </select>


              {/* Status */}
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value
                  }))
                }
                className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
              >

                {statuses.map((status) => (

                  <option
                    key={status}
                    value={
                      status === 'All'
                        ? ''
                        : status
                    }
                  >
                    {status}
                  </option>

                ))}

              </select>


              {/* Priority */}
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priority: e.target.value
                  }))
                }
                className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
              >

                {priorities.map((priority) => (

                  <option
                    key={priority}
                    value={
                      priority === 'All'
                        ? ''
                        : priority
                    }
                  >
                    {priority}
                  </option>

                ))}

              </select>


              {/* Clear */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                Clear All
              </button>

            </div>

          </div>


          {/* Problems */}
          {filteredProblems.length === 0 ? (

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-12 text-center">

              <div className="text-4xl mb-3">
                🔍
              </div>

              <p className="text-gray-500">
                No problems found
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters or check back later
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {filteredProblems.map((problem) => (

                <Link
                  key={problem._id}
                  to={`/student/problem/${problem._id}`}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-[#FFCABE]"
                >

                  {/* Title and Priority */}
                  <div className="flex items-start justify-between mb-2">

                    <h3 className="font-semibold text-gray-700 line-clamp-1">
                      {problem.title}
                    </h3>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        problem.priority === 'Urgent'
                          ? 'bg-red-50 text-red-600'
                          : problem.priority === 'High'
                          ? 'bg-orange-50 text-orange-600'
                          : problem.priority === 'Medium'
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {problem.priority || 'Medium'}
                    </span>

                  </div>


                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {problem.description}
                  </p>


                  {/* Category and Status */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">

                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {problem.category}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded ${
                        problem.status === 'Pending'
                          ? 'bg-yellow-50 text-yellow-600'
                          : problem.status === 'Under Review'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {problem.status}
                    </span>

                  </div>


                  {/* Location */}
                  {problem.location?.address && (

                    <p className="text-xs text-gray-400 flex items-center gap-1">

                      <FaMapMarkerAlt
                        className="text-[#D4A09A]"
                        size={10}
                      />

                      <span className="line-clamp-1">
                        {problem.location.address}
                      </span>

                    </p>

                  )}


                  {/* Date */}
                  <p className="text-xs text-gray-400 mt-2">
                    Reported:{' '}
                    {problem.createdAt
                      ? new Date(
                          problem.createdAt
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>

                </Link>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default FindProblems;