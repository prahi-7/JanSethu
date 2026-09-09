import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaSpinner,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const IndustryProblemDetail = () => {
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
        `http://localhost:5000/api/industry/problems/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log('📥 Industry problem details:', data);

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
        '❌ Industry problem error:',
        error
      );

      toast.error(
        error.message || 'Failed to load problem'
      );

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="industry" />

        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4A09A]" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="industry" />

        <div className="flex-1 md:ml-64 p-8 text-center">

          <h2 className="text-xl font-semibold text-gray-700">
            Problem not found
          </h2>

          <Link
            to="/industry/dashboard"
            className="inline-flex items-center gap-2 mt-4 text-[#D4A09A]"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="industry" />

      <div className="flex-1 p-4 md:p-8 md:ml-64">

        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <Link
            to="/industry/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4A09A] mb-5"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>


          {/* Main Problem */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex flex-wrap gap-2 mb-4">

              {problem.category && (
                <span className="px-3 py-1 bg-[#FFF5F2] text-[#D4A09A] rounded-full text-xs">
                  {problem.category}
                </span>
              )}

              {problem.status && (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                  {problem.status}
                </span>
              )}

              {problem.priority && (
                <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs">
                  {problem.priority}
                </span>
              )}

            </div>


            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
              {problem.title}
            </h1>

            <p className="text-gray-500 mt-4 leading-relaxed">
              {problem.description}
            </p>


            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

              <div className="bg-gray-50 rounded-xl p-4">

                <div className="flex items-center gap-3">

                  <FaMapMarkerAlt className="text-[#D4A09A]" />

                  <div>
                    <p className="text-xs text-gray-400">
                      Location
                    </p>

                    <p className="text-sm text-gray-700">
                      {typeof problem.location === 'string'
                        ? problem.location
                        : problem.location?.address ||
                          problem.location?.name ||
                          'Location not provided'}
                    </p>
                  </div>

                </div>

              </div>


              <div className="bg-gray-50 rounded-xl p-4">

                <div className="flex items-center gap-3">

                  <FaCalendarAlt className="text-[#D4A09A]" />

                  <div>
                    <p className="text-xs text-gray-400">
                      Reported On
                    </p>

                    <p className="text-sm text-gray-700">
                      {problem.createdAt
                        ? new Date(
                            problem.createdAt
                          ).toLocaleDateString()
                        : 'Not available'}
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* Citizen */}
            {problem.citizen && (
              <div className="mt-6 p-4 bg-[#FFF5F2] rounded-xl">

                <div className="flex items-center gap-3">

                  <FaUser className="text-[#D4A09A]" />

                  <div>

                    <p className="text-xs text-gray-400">
                      Reported By
                    </p>

                    <p className="font-medium text-gray-700">
                      {problem.citizen.name ||
                        'Citizen'}
                    </p>

                    {problem.citizen.email && (
                      <p className="text-sm text-gray-400">
                        {problem.citizen.email}
                      </p>
                    )}

                  </div>

                </div>

              </div>
            )}


            {/* Photos */}
            {problem.photos?.length > 0 && (
              <div className="mt-6">

                <h2 className="font-semibold text-gray-700 mb-3">
                  Problem Photos
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                  {problem.photos.map((photo, index) => {

                    const imageUrl =
                      typeof photo === 'string'
                        ? photo
                        : photo.url;

                    return (
                      <a
                        key={index}
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={imageUrl}
                          alt={`Problem ${index + 1}`}
                          className="w-full h-40 object-cover rounded-xl border border-gray-100 hover:opacity-90"
                        />
                      </a>
                    );
                  })}

                </div>

              </div>
            )}


            {/* Videos */}
            {problem.videos?.length > 0 && (
              <div className="mt-6">

                <h2 className="font-semibold text-gray-700 mb-3">
                  Problem Videos
                </h2>

                <div className="space-y-3">

                  {problem.videos.map((video, index) => {

                    const videoUrl =
                      typeof video === 'string'
                        ? video
                        : video.url;

                    return (
                      <video
                        key={index}
                        src={videoUrl}
                        controls
                        className="w-full max-h-96 rounded-xl bg-black"
                      />
                    );
                  })}

                </div>

              </div>
            )}


            {/* Priority Notice */}
            {problem.priority === 'Urgent' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">

                <FaExclamationTriangle />

                <span className="text-sm font-medium">
                  This problem has been marked as urgent.
                </span>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default IndustryProblemDetail;