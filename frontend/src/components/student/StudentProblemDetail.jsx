import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUsers,
  FaSpinner
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const StudentProblemDetail = () => {
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
        `http://localhost:5000/api/problems/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log('📥 Problem details:', data);

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
      console.error('❌ Error fetching problem:', error);
      toast.error(error.message || 'Failed to load problem');
    } finally {
      setLoading(false);
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

  if (!problem) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="student" />

        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              Problem not found.
            </p>

            <Link
              to="/student/find-problems"
              className="text-[#D4A09A]"
            >
              ← Back to Problems
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <Link
            to="/student/find-problems"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4A09A] mb-6"
          >
            <FaArrowLeft />
            Back to Problems
          </Link>

          {/* Problem */}
          <div className="bg-white/90 rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                  {problem.title}
                </h1>

                <p className="text-sm text-gray-400 mt-2">
                  Reported on{' '}
                  {problem.createdAt
                    ? new Date(problem.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">
                {problem.status || 'Pending'}
              </span>

            </div>

            {/* Category / Priority */}
            <div className="flex flex-wrap gap-2 mt-6">

              <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm">
                {problem.category || 'Other'}
              </span>

              <span className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-600 text-sm">
                Priority: {problem.priority || 'Medium'}
              </span>

            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-semibold text-gray-700 mb-2">
                Problem Description
              </h2>

              <p className="text-gray-500 leading-relaxed">
                {problem.description}
              </p>
            </div>

            {/* Location */}
            {problem.location?.address && (
              <div className="mt-6">
                <h2 className="font-semibold text-gray-700 mb-2">
                  Location
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaMapMarkerAlt className="text-[#D4A09A]" />
                  {problem.location.address}
                </div>
              </div>
            )}

            {/* Team Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">

              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaUsers className="text-[#D4A09A]" />
                Solve This Problem
              </h2>

              <p className="text-sm text-gray-400 mt-1 mb-4">
                Form a team of up to 6 students and work together
                to submit a solution.
              </p>

              <div className="flex flex-wrap gap-3">

                {/* IMPORTANT:
                    Pass both problem and problemId through
                    React Router state so CreateTeam.jsx can
                    load recommended students.
                */}
                <Link
                  to={`/student/teams/create?problemId=${problem._id}`}
                  state={{
                    problem: problem,
                    problemId: problem._id
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white font-semibold hover:shadow-md transition"
                >
                  Create Team
                </Link>

                <Link
                  to="/student/teams"
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Join Existing Team
                </Link>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProblemDetail;