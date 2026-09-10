import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaEye,
  FaRobot,
  FaUniversity,
  FaBrain,
  FaMicrochip,
  FaLightbulb,
  FaSpinner
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CitizenDashboard = () => {
  const { user } = useAuth();

  const [problems, setProblems] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    solved: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  // ----------------------------------------------------------
  // Fetch problems
  // ----------------------------------------------------------

  useEffect(() => {
    if (user?._id) {
      fetchProblems();
    }
  }, [user]);

  // ----------------------------------------------------------
  // Automatically refresh while AI is processing
  // ----------------------------------------------------------

  useEffect(() => {
    if (!problems.length) return;

    const hasPendingAI = problems.some(
      problem =>
        problem.aiAnalysis?.status === 'Pending'
    );

    if (!hasPendingAI) return;

    const interval = setInterval(() => {
      fetchProblems(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [problems]);

  // ----------------------------------------------------------
  // Update statistics
  // ----------------------------------------------------------

  const updateStats = (problemsList) => {
    const stats = {
      total: problemsList.length,

      pending: problemsList.filter(
        p => p.status === 'Pending'
      ).length,

      inProgress: problemsList.filter(
        p =>
          p.status === 'In Progress' ||
          p.status === 'Under Review'
      ).length,

      solved: problemsList.filter(
        p => p.status === 'Solved'
      ).length
    };

    setStats(stats);
  };

  // ----------------------------------------------------------
  // Fetch citizen problems
  // ----------------------------------------------------------

  const fetchProblems = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }

      const token =
        localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');

        if (!silent) {
          setIsLoading(false);
        }

        return;
      }

      console.log(
        '🔍 Fetching problems for user:',
        user._id
      );

      // ------------------------------------------------------
      // Citizen-specific endpoint
      // ------------------------------------------------------

      let response = await fetch(
        `http://localhost:5000/api/problems/citizen/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      let data = await response.json();

      console.log(
        '📥 Citizen endpoint response:',
        data
      );

      // ------------------------------------------------------
      // Fallback to all problems
      // ------------------------------------------------------

      if (
        !data.success ||
        (
          data.data?.data?.length === 0 &&
          data.data?.length === 0
        )
      ) {
        console.log(
          '🔄 Trying fallback: fetching all problems'
        );

        response = await fetch(
          'http://localhost:5000/api/problems',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        data = await response.json();

        console.log(
          '📥 All problems response:',
          data
        );

        if (data.success) {
          const allProblems =
            data.data?.data ||
            data.data ||
            [];

          const citizenProblems =
            allProblems.filter(problem =>
              problem.citizen?._id === user._id ||
              problem.citizen === user._id ||
              problem.citizenId === user._id
            );

          console.log(
            '📊 Filtered problems:',
            citizenProblems
          );

          setProblems(citizenProblems);

          updateStats(citizenProblems);

          if (!silent) {
            setIsLoading(false);
          }

          return;
        }
      }

      // ------------------------------------------------------
      // Normal response
      // ------------------------------------------------------

      if (data.success) {
        const problemsList =
          data.data?.data ||
          data.data ||
          [];

        console.log(
          '📊 Problems with AI data:',
          problemsList
        );

        setProblems(problemsList);

        updateStats(problemsList);
      } else if (!silent) {
        toast.error(
          data.message ||
          'Failed to load problems'
        );
      }

    } catch (error) {
      console.error(
        '❌ Error fetching problems:',
        error
      );

      if (!silent) {
        toast.error(
          'Failed to load dashboard'
        );
      }

    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  // ----------------------------------------------------------
  // Status color
  // ----------------------------------------------------------

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved':
        return 'text-green-500 bg-green-50';

      case 'Pending':
        return 'text-yellow-500 bg-yellow-50';

      case 'Under Review':
        return 'text-blue-500 bg-blue-50';

      case 'In Progress':
        return 'text-purple-500 bg-purple-50';

      case 'Rejected':
        return 'text-red-500 bg-red-50';

      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  // ----------------------------------------------------------
  // Status icon
  // ----------------------------------------------------------

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Solved':
        return <FaCheckCircle />;

      case 'Pending':
        return <FaClock />;

      case 'Rejected':
        return <FaExclamationTriangle />;

      default:
        return <FaClock />;
    }
  };

  // ----------------------------------------------------------
  // AI status
  // ----------------------------------------------------------

  const getAIStatus = (problem) => {
    return (
      problem?.aiAnalysis?.status ||
      'Pending'
    );
  };

  // ----------------------------------------------------------
  // Confidence percentage
  // ----------------------------------------------------------

  const getConfidencePercentage = (problem) => {
    const confidence =
      problem?.aiAnalysis?.confidence;

    if (
      confidence === undefined ||
      confidence === null
    ) {
      return null;
    }

    const value =
      Number(confidence);

    if (Number.isNaN(value)) {
      return null;
    }

    // AI normally returns 0-1
    if (value <= 1) {
      return Math.round(value * 100);
    }

    return Math.round(value);
  };

  // ----------------------------------------------------------
  // Match percentage
  // ----------------------------------------------------------

  const getMatchPercentage = (institution) => {
    const value =
      institution?.matchScore ??
      institution?.score ??
      institution?.similarity;

    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    const number =
      Number(value);

    if (Number.isNaN(number)) {
      return null;
    }

    if (number <= 1) {
      return Math.round(number * 100);
    }

    return Math.round(number);
  };

  // ----------------------------------------------------------
  // AI Analysis Section
  // ----------------------------------------------------------

  const renderAIAnalysis = (problem) => {
    const ai = problem?.aiAnalysis;

    const status =
      getAIStatus(problem);

    // --------------------------------------------------------
    // Pending
    // --------------------------------------------------------

    if (
      status === 'Pending' ||
      !ai
    ) {
      return (
        <div
          className="mt-4 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50/80 to-white p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
              <FaRobot className="text-purple-500 animate-pulse" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">
                  AI Analysis
                </p>

                <FaSpinner className="text-purple-400 animate-spin text-xs" />
              </div>

              <p className="text-xs text-gray-400 mt-0.5">
                AI is analyzing your problem and finding relevant institutions...
              </p>
            </div>

            <span className="text-xs font-medium text-purple-500 bg-purple-100 px-2.5 py-1 rounded-full">
              Analyzing
            </span>
          </div>
        </div>
      );
    }

    // --------------------------------------------------------
    // Failed
    // --------------------------------------------------------

    if (status === 'Failed') {
      return (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700">
                AI Analysis
              </p>

              <p className="text-xs text-gray-400">
                AI analysis could not be completed. The problem itself is still safely saved.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // --------------------------------------------------------
    // Completed
    // --------------------------------------------------------

    const confidence =
      getConfidencePercentage(problem);

    const institutions =
      Array.isArray(ai.institutionMatches)
        ? ai.institutionMatches
        : [];

    const disciplines =
      Array.isArray(ai.disciplines)
        ? ai.disciplines
        : [];

    const technologies =
      Array.isArray(ai.technologies)
        ? ai.technologies
        : [];

    const keywords =
      Array.isArray(ai.keywords)
        ? ai.keywords
        : [];

    const suggestedActions =
      Array.isArray(ai.suggestedActions)
        ? ai.suggestedActions
        : [];

    return (
      <div
        className="mt-4 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/70 via-white to-blue-50/50 p-4"
      >

        {/* -------------------------------------------------- */}
        {/* AI Header */}
        {/* -------------------------------------------------- */}

        <div className="flex items-center justify-between gap-3 mb-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FaBrain className="text-purple-500" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700 text-sm">
                  AI Analysis Complete
                </p>

                <span className="text-[10px] font-medium text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  Completed
                </span>
              </div>

              <p className="text-xs text-gray-400">
                Your problem has been analyzed automatically
              </p>
            </div>

          </div>

          {confidence !== null && (
            <div className="text-center">

              <div className="text-lg font-bold text-purple-500">
                {confidence}%
              </div>

              <div className="text-[10px] text-gray-400">
                AI confidence
              </div>

            </div>
          )}

        </div>


        {/* -------------------------------------------------- */}
        {/* Category + Priority */}
        {/* -------------------------------------------------- */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

          <div className="bg-white rounded-lg border border-gray-100 p-3">

            <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
              AI Category
            </p>

            <p className="text-sm font-semibold text-gray-700">
              {ai.category ||
                problem.category ||
                'Not available'}
            </p>

          </div>


          <div className="bg-white rounded-lg border border-gray-100 p-3">

            <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
              AI Priority
            </p>

            <p className="text-sm font-semibold text-gray-700">
              {ai.priority ||
                problem.priority ||
                'Not available'}
            </p>

          </div>

        </div>


        {/* -------------------------------------------------- */}
        {/* Summary */}
        {/* -------------------------------------------------- */}

        {ai.summary && (
          <div className="bg-white rounded-lg border border-gray-100 p-3 mb-3">

            <div className="flex items-center gap-2 mb-1.5">

              <FaLightbulb className="text-yellow-400 text-xs" />

              <p className="text-xs font-semibold text-gray-600">
                AI Summary
              </p>

            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              {ai.summary}
            </p>

          </div>
        )}


        {/* -------------------------------------------------- */}
        {/* Disciplines */}
        {/* -------------------------------------------------- */}

        {disciplines.length > 0 && (
          <div className="mb-3">

            <div className="flex items-center gap-2 mb-2">

              <FaBrain className="text-purple-400 text-xs" />

              <p className="text-xs font-semibold text-gray-600">
                Related Disciplines
              </p>

            </div>

            <div className="flex flex-wrap gap-1.5">

              {disciplines.map(
                (item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100"
                  >
                    {item}
                  </span>
                )
              )}

            </div>

          </div>
        )}


        {/* -------------------------------------------------- */}
        {/* Technologies */}
        {/* -------------------------------------------------- */}

        {technologies.length > 0 && (
          <div className="mb-3">

            <div className="flex items-center gap-2 mb-2">

              <FaMicrochip className="text-blue-400 text-xs" />

              <p className="text-xs font-semibold text-gray-600">
                Relevant Technologies
              </p>

            </div>

            <div className="flex flex-wrap gap-1.5">

              {technologies.map(
                (item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                  >
                    {item}
                  </span>
                )
              )}

            </div>

          </div>
        )}


        {/* -------------------------------------------------- */}
        {/* Keywords */}
        {/* -------------------------------------------------- */}

        {keywords.length > 0 && (
          <div className="mb-3">

            <p className="text-xs font-semibold text-gray-600 mb-2">
              Keywords
            </p>

            <div className="flex flex-wrap gap-1.5">

              {keywords.slice(0, 8).map(
                (item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="text-[11px] px-2 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-100"
                  >
                    #{item}
                  </span>
                )
              )}

            </div>

          </div>
        )}


        {/* -------------------------------------------------- */}
        {/* Institution Matches */}
        {/* -------------------------------------------------- */}

        <div className="mt-4">

          <div className="flex items-center justify-between mb-3">

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-lg bg-[#FFF0EC] flex items-center justify-center">
                <FaUniversity className="text-[#D4A09A] text-sm" />
              </div>

              <div>

                <p className="text-sm font-semibold text-gray-700">
                  Relevant Institutions
                </p>

                <p className="text-[10px] text-gray-400">
                  Institutions whose research areas match this problem
                </p>

              </div>

            </div>

            {institutions.length > 0 && (
              <span className="text-[10px] text-gray-400">
                {institutions.length} found
              </span>
            )}

          </div>


          {institutions.length === 0 ? (

            <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">

              <FaUniversity className="text-gray-300 mx-auto mb-2" />

              <p className="text-xs text-gray-500">
                No matching institutions found yet.
              </p>

              <p className="text-[10px] text-gray-400 mt-1">
                More institution data can be added to improve matching.
              </p>

            </div>

          ) : (

            <div className="space-y-2">

              {institutions
                .slice(0, 5)
                .map((institution, index) => {

                  const match =
                    getMatchPercentage(
                      institution
                    );

                  return (
                    <div
                      key={
                        institution.institutionId ||
                        institution._id ||
                        `${institution.name}-${index}`
                      }
                      className="bg-white rounded-lg border border-gray-100 p-3 hover:shadow-sm transition-shadow"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center gap-2">

                            <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0">
                              <FaUniversity className="text-gray-400 text-xs" />
                            </div>

                            <div className="min-w-0">

                              <p className="text-sm font-semibold text-gray-700 truncate">
                                {institution.name ||
                                  'Institution'}
                              </p>

                              {institution.type && (
                                <p className="text-[10px] text-gray-400">
                                  {institution.type}
                                </p>
                              )}

                            </div>

                          </div>


                          {/* Location */}

                          {institution.location && (
                            <p className="text-[10px] text-gray-400 mt-1 ml-9">
                              📍 {institution.location}
                            </p>
                          )}


                          {/* Matched areas */}

                          {Array.isArray(
                            institution.matchedAreas
                          ) &&
                          institution.matchedAreas.length > 0 && (

                            <div className="flex flex-wrap gap-1 mt-2 ml-9">

                              {institution.matchedAreas
                                .slice(0, 4)
                                .map(
                                  (
                                    area,
                                    areaIndex
                                  ) => (
                                    <span
                                      key={`${area}-${areaIndex}`}
                                      className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600"
                                    >
                                      {area}
                                    </span>
                                  )
                                )}

                            </div>

                          )}


                          {/* Matched technologies */}

                          {Array.isArray(
                            institution.matchedTechnologies
                          ) &&
                          institution.matchedTechnologies.length > 0 && (

                            <div className="flex flex-wrap gap-1 mt-1 ml-9">

                              {institution.matchedTechnologies
                                .slice(0, 3)
                                .map(
                                  (
                                    tech,
                                    techIndex
                                  ) => (
                                    <span
                                      key={`${tech}-${techIndex}`}
                                      className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
                                    >
                                      {tech}
                                    </span>
                                  )
                                )}

                            </div>

                          )}


                          {/* Reason */}

                          {Array.isArray(
                            institution.reasons
                          ) &&
                          institution.reasons.length > 0 && (

                            <p className="text-[10px] text-gray-400 mt-2 ml-9 leading-relaxed">
                              💡 {institution.reasons[0]}
                            </p>

                          )}

                        </div>


                        {/* Match score */}

                        {match !== null && (

                          <div className="flex-shrink-0 text-center">

                            <div className="w-12 h-12 rounded-full border-4 border-purple-100 flex items-center justify-center">

                              <span className="text-xs font-bold text-purple-500">
                                {match}%
                              </span>

                            </div>

                            <p className="text-[9px] text-gray-400 mt-1">
                              match
                            </p>

                          </div>

                        )}

                      </div>

                    </div>
                  );
                })}

            </div>

          )}

        </div>


        {/* -------------------------------------------------- */}
        {/* Suggested Actions */}
        {/* -------------------------------------------------- */}

        {suggestedActions.length > 0 && (

          <div className="mt-4 bg-white rounded-lg border border-gray-100 p-3">

            <div className="flex items-center gap-2 mb-2">

              <FaLightbulb className="text-yellow-400 text-xs" />

              <p className="text-xs font-semibold text-gray-600">
                Suggested Actions
              </p>

            </div>

            <ul className="space-y-1">

              {suggestedActions
                .slice(0, 3)
                .map(
                  (action, index) => (
                    <li
                      key={`${action}-${index}`}
                      className="text-[11px] text-gray-500 flex gap-2"
                    >
                      <span className="text-purple-400">
                        •
                      </span>

                      <span>
                        {action}
                      </span>
                    </li>
                  )
                )}

            </ul>

          </div>

        )}

      </div>
    );
  };

  // ----------------------------------------------------------
  // Loading screen
  // ----------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

        <Sidebar role="citizen" />

        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-500">
              Loading your problems...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ----------------------------------------------------------
  // Main dashboard
  // ----------------------------------------------------------

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="citizen" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-6xl mx-auto">

          {/* ------------------------------------------------ */}
          {/* Header */}
          {/* ------------------------------------------------ */}

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                My Dashboard
              </h1>

              <p className="text-gray-400 text-sm">
                Welcome back, {user?.name}!
              </p>

            </div>

            <Link
              to="/citizen/report"
              className="mt-3 md:mt-0 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <FaPlus />

              Report New Problem
            </Link>

          </div>


          {/* ------------------------------------------------ */}
          {/* Stats Cards */}
          {/* ------------------------------------------------ */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">

              <p className="text-gray-400 text-sm">
                Total
              </p>

              <p className="text-2xl font-bold text-gray-700">
                {stats.total}
              </p>

            </div>


            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-yellow-100">

              <p className="text-yellow-500 text-sm">
                Pending
              </p>

              <p className="text-2xl font-bold text-yellow-500">
                {stats.pending}
              </p>

            </div>


            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">

              <p className="text-purple-500 text-sm">
                In Progress
              </p>

              <p className="text-2xl font-bold text-purple-500">
                {stats.inProgress}
              </p>

            </div>


            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-100">

              <p className="text-green-500 text-sm">
                Solved
              </p>

              <p className="text-2xl font-bold text-green-500">
                {stats.solved}
              </p>

            </div>

          </div>


          {/* ------------------------------------------------ */}
          {/* Problems List */}
          {/* ------------------------------------------------ */}

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">

            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              My Problems
            </h2>

            {problems.length === 0 ? (

              <div className="text-center py-8">

                <div className="text-4xl mb-3">
                  📋
                </div>

                <p className="text-gray-400">
                  No problems reported yet
                </p>

                <Link
                  to="/citizen/report"
                  className="inline-block mt-3 text-[#D4A09A] hover:text-[#8B5E5E] font-medium"
                >
                  Report your first problem →
                </Link>

              </div>

            ) : (

              <div className="space-y-3">

                {problems.map(
                  (problem) => (

                    <div
                      key={problem._id}
                      className="bg-white hover:shadow-md transition-shadow rounded-xl p-4 border border-gray-100"
                    >

                      {/* -------------------------------------- */}
                      {/* Problem Header */}
                      {/* -------------------------------------- */}

                      <Link
                        to={`/citizen/problem/${problem._id}`}
                        className="block"
                      >

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

                          <div className="flex-1 min-w-0">

                            <h3 className="font-semibold text-gray-700">
                              {problem.title}
                            </h3>

                            <p className="text-sm text-gray-400 line-clamp-1">
                              {problem.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-1">

                              <span className="text-xs text-gray-400">
                                {problem.category}
                              </span>

                              <span className="text-xs text-gray-300">
                                •
                              </span>

                              <span className="text-xs text-gray-400">

                                {new Date(
                                  problem.createdAt
                                ).toLocaleDateString(
                                  'en-IN',
                                  {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  }
                                )}

                              </span>

                              {problem.location?.address && (
                                <>
                                  <span className="text-xs text-gray-300">
                                    •
                                  </span>

                                  <span className="text-xs text-gray-400 flex items-center gap-1">

                                    <FaMapMarkerAlt
                                      className="text-[#D4A09A]"
                                      size={10}
                                    />

                                    {problem.location.address}

                                  </span>
                                </>
                              )}

                            </div>

                          </div>


                          <div className="flex items-center gap-3">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                problem.status
                              )}`}
                            >

                              {getStatusIcon(
                                problem.status
                              )}

                              {problem.status}

                            </span>

                            <FaEye className="text-gray-300 hover:text-[#D4A09A] transition-colors" />

                          </div>

                        </div>

                      </Link>


                      {/* -------------------------------------- */}
                      {/* AI Analysis */}
                      {/* -------------------------------------- */}

                      {renderAIAnalysis(
                        problem
                      )}

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default CitizenDashboard;