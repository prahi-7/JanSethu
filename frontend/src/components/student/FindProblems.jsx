import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaSpinner,
  FaRobot,
  FaUsers,
  FaCheckCircle,
  FaCodeBranch
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

  /*
   * =========================================================
   * AI COLLABORATION MATCHING
   * =========================================================
   *
   * This calculates how relevant the problem is to the
   * currently logged-in student's profile.
   *
   * IMPORTANT:
   * This is only a recommendation.
   * It does NOT assign the student to the problem.
   */

  const normalizeText = (value) => {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(Boolean)
      .map(normalizeText)
      .filter(Boolean);
  };

  /*
   * Get all useful information from student's profile.
   */
  const getStudentProfile = () => {
    return {
      department: normalizeText(user?.department),
      designation: normalizeText(user?.designation),
      skills: normalizeArray(user?.skills),
      expertise: normalizeArray(user?.expertise),
      university: normalizeText(user?.university)
    };
  };

  /*
   * Get AI-generated requirements from the problem.
   */
  const getProblemRequirements = (problem) => {
    const ai = problem?.aiAnalysis || {};

    return {
      category: normalizeText(
        ai.category || problem?.category
      ),

      priority: normalizeText(
        ai.priority || problem?.priority
      ),

      disciplines: normalizeArray(
        ai.disciplines
      ),

      technologies: normalizeArray(
        ai.technologies
      ),

      keywords: normalizeArray(
        ai.keywords
      ),

      departments: normalizeArray(
        ai.departments
      )
    };
  };

  /*
   * Check whether two terms are meaningfully related.
   */
  const termsMatch = (studentTerm, requirement) => {
    if (!studentTerm || !requirement) {
      return false;
    }

    if (
      studentTerm === requirement ||
      requirement.includes(studentTerm) ||
      studentTerm.includes(requirement)
    ) {
      return true;
    }

    /*
     * Compare individual words too.
     *
     * Example:
     * "computer science" ↔ "computer"
     * "machine learning" ↔ "learning"
     */
    const studentWords = studentTerm
      .split(' ')
      .filter(word => word.length >= 3);

    const requirementWords = requirement
      .split(' ')
      .filter(word => word.length >= 3);

    return studentWords.some(word =>
      requirementWords.includes(word)
    );
  };

  /*
   * Find matching terms between two arrays.
   */
  const getMatchedTerms = (
    studentTerms,
    requirementTerms
  ) => {
    const matched = [];

    studentTerms.forEach(studentTerm => {
      requirementTerms.forEach(requirement => {
        if (
          termsMatch(
            studentTerm,
            requirement
          )
        ) {
          if (!matched.includes(requirement)) {
            matched.push(requirement);
          }
        }
      });
    });

    return matched;
  };

  /*
   * =========================================================
   * CALCULATE STUDENT ↔ PROBLEM MATCH
   * =========================================================
   *
   * Weighted calculation:
   *
   * Skills       → 30%
   * Expertise    → 20%
   * Department   → 20%
   * Technologies → 15%
   * Disciplines  → 10%
   * Keywords     → 5%
   *
   * If some AI fields are missing, the available fields are
   * used instead of producing a misleading score.
   */

  const calculateMatch = (problem) => {
    const student = getStudentProfile();
    const requirements = getProblemRequirements(problem);

    const skillMatches = getMatchedTerms(
      student.skills,
      [
        ...requirements.technologies,
        ...requirements.keywords,
        ...requirements.disciplines
      ]
    );

    const expertiseMatches = getMatchedTerms(
      student.expertise,
      [
        ...requirements.disciplines,
        ...requirements.keywords,
        ...requirements.technologies
      ]
    );

    const departmentMatches = [];

    if (
      student.department &&
      requirements.departments.some(
        department =>
          termsMatch(
            student.department,
            department
          )
      )
    ) {
      departmentMatches.push(
        student.department
      );
    }

    /*
     * Sometimes AI identifies a discipline rather than
     * explicitly identifying a department.
     */
    if (
      student.department &&
      requirements.disciplines.some(
        discipline =>
          termsMatch(
            student.department,
            discipline
          )
      )
    ) {
      departmentMatches.push(
        student.department
      );
    }

    const technologyMatches = getMatchedTerms(
      student.skills,
      requirements.technologies
    );

    const disciplineMatches = getMatchedTerms(
      [
        ...student.skills,
        ...student.expertise,
        student.department
      ].filter(Boolean),
      requirements.disciplines
    );

    const keywordMatches = getMatchedTerms(
      [
        ...student.skills,
        ...student.expertise
      ],
      requirements.keywords
    );

    /*
     * Build weighted components.
     */

    const components = [];

    /*
     * Skills
     */
    if (requirements.technologies.length > 0 ||
        requirements.keywords.length > 0 ||
        requirements.disciplines.length > 0) {

      const totalSkillRequirements =
        new Set([
          ...requirements.technologies,
          ...requirements.keywords,
          ...requirements.disciplines
        ]).size;

      const skillScore =
        totalSkillRequirements > 0
          ? Math.min(
              100,
              (skillMatches.length /
                totalSkillRequirements) *
                100
            )
          : 0;

      components.push({
        score: skillScore,
        weight: 0.30
      });
    }

    /*
     * Expertise
     */
    if (requirements.disciplines.length > 0 ||
        requirements.keywords.length > 0) {

      const totalExpertiseRequirements =
        new Set([
          ...requirements.disciplines,
          ...requirements.keywords
        ]).size;

      const expertiseScore =
        totalExpertiseRequirements > 0
          ? Math.min(
              100,
              (expertiseMatches.length /
                totalExpertiseRequirements) *
                100
            )
          : 0;

      components.push({
        score: expertiseScore,
        weight: 0.20
      });
    }

    /*
     * Department
     */
    if (
      requirements.departments.length > 0 ||
      requirements.disciplines.length > 0
    ) {
      const departmentScore =
        departmentMatches.length > 0
          ? 100
          : 0;

      components.push({
        score: departmentScore,
        weight: 0.20
      });
    }

    /*
     * Technologies
     */
    if (requirements.technologies.length > 0) {
      const technologyScore =
        Math.min(
          100,
          (technologyMatches.length /
            requirements.technologies.length) *
            100
        );

      components.push({
        score: technologyScore,
        weight: 0.15
      });
    }

    /*
     * Disciplines
     */
    if (requirements.disciplines.length > 0) {
      const disciplineScore =
        Math.min(
          100,
          (disciplineMatches.length /
            requirements.disciplines.length) *
            100
        );

      components.push({
        score: disciplineScore,
        weight: 0.10
      });
    }

    /*
     * Keywords
     */
    if (requirements.keywords.length > 0) {
      const keywordScore =
        Math.min(
          100,
          (keywordMatches.length /
            requirements.keywords.length) *
            100
        );

      components.push({
        score: keywordScore,
        weight: 0.05
      });
    }

    /*
     * If AI has not processed the problem yet.
     */
    const aiProcessed =
      problem?.aiAnalysis?.status === 'Completed';

    if (!aiProcessed) {
      return {
        score: 0,
        level: 'AI Processing',
        matched: false,
        aiProcessed: false,
        matchedSkills: [],
        matchedExpertise: [],
        matchedTechnologies: [],
        matchedDisciplines: []
      };
    }

    /*
     * Student has no profile information.
     */
    const hasStudentProfile =
      student.department ||
      student.skills.length ||
      student.expertise.length;

    if (!hasStudentProfile) {
      return {
        score: 0,
        level: 'Profile Needed',
        matched: false,
        aiProcessed: true,
        matchedSkills: [],
        matchedExpertise: [],
        matchedTechnologies: [],
        matchedDisciplines: []
      };
    }

    /*
     * No requirements detected.
     */
    if (components.length === 0) {
      return {
        score: 0,
        level: 'AI Processing',
        matched: false,
        aiProcessed: true,
        matchedSkills: [],
        matchedExpertise: [],
        matchedTechnologies: [],
        matchedDisciplines: []
      };
    }

    /*
     * Normalize weights because some fields may not exist.
     */
    const totalWeight =
      components.reduce(
        (sum, component) =>
          sum + component.weight,
        0
      );

    const weightedScore =
      components.reduce(
        (sum, component) =>
          sum +
          component.score *
            component.weight,
        0
      ) / totalWeight;

    const percentage = Math.round(
      Math.min(
        100,
        Math.max(
          0,
          weightedScore
        )
      )
    );

    let level = 'Different Expertise';
    let matched = false;

    if (percentage >= 75) {
      level = 'Strong Match';
      matched = true;
    } else if (percentage >= 50) {
      level = 'Good Match';
      matched = true;
    } else if (percentage >= 25) {
      level = 'Possible Match';
      matched = true;
    }

    return {
      score: percentage,
      level,
      matched,
      aiProcessed: true,

      matchedSkills: skillMatches,
      matchedExpertise: expertiseMatches,
      matchedTechnologies: technologyMatches,
      matchedDisciplines: disciplineMatches
    };
  };

  /*
   * Apply search and filters.
   */
  useEffect(() => {
    let filtered = [...problems];

    if (searchTerm.trim()) {
      const search =
        searchTerm.toLowerCase();

      filtered = filtered.filter(
        (problem) =>
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

    if (filters.category) {
      filtered = filtered.filter(
        (problem) =>
          problem.category ===
          filters.category
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (problem) =>
          problem.status ===
          filters.status
      );
    }

    if (filters.priority) {
      filtered = filtered.filter(
        (problem) =>
          problem.priority ===
          filters.priority
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
                    setSearchTerm(
                      e.target.value
                    )
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
                    category:
                      e.target.value
                  }))
                }
                className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
              >

                {categories.map(
                  (category) => (

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

                  )
                )}

              </select>

              {/* Status */}
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status:
                      e.target.value
                  }))
                }
                className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
              >

                {statuses.map(
                  (status) => (

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

                  )
                )}

              </select>

              {/* Priority */}
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priority:
                      e.target.value
                  }))
                }
                className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
              >

                {priorities.map(
                  (priority) => (

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

                  )
                )}

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

              {filteredProblems.map(
                (problem) => {

                  const match =
                    calculateMatch(
                      problem
                    );

                  const disciplines =
                    getProblemRequirements(
                      problem
                    ).disciplines;

                  const technologies =
                    getProblemRequirements(
                      problem
                    ).technologies;

                  const aiProcessed =
                    problem?.aiAnalysis &&
                    problem.aiAnalysis
                      .status ===
                      'Completed';

                  return (

                    <Link
                      key={problem._id}
                      to={`/student/problem/${problem._id}`}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-[#FFCABE] relative overflow-hidden"
                    >

                      {/* AI indicator */}
                      {aiProcessed && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFCABE] via-purple-300 to-blue-300" />
                      )}

                      {/* Title and Priority */}
                      <div className="flex items-start justify-between mb-2">

                        <h3 className="font-semibold text-gray-700 line-clamp-1 pr-2">
                          {problem.title}
                        </h3>

                        <span
                          className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                            problem.priority ===
                            'Urgent'
                              ? 'bg-red-50 text-red-600'
                              : problem.priority ===
                                'High'
                              ? 'bg-orange-50 text-orange-600'
                              : problem.priority ===
                                'Medium'
                              ? 'bg-yellow-50 text-yellow-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {problem.priority ||
                            'Medium'}
                        </span>

                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {problem.description}
                      </p>

                      {/* AI Match */}
                      <div className="mb-4 rounded-xl bg-gradient-to-r from-[#FFF7F5] via-white to-blue-50 border border-[#F4E4E1] p-3">

                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-2">

                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">

                              <FaRobot className="text-[#D4A09A] text-sm" />

                            </div>

                            <div>

                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                AI Match
                              </p>

                              <p className="text-xs font-semibold text-gray-600">
                                {match.level}
                              </p>

                            </div>

                          </div>

                          {/* Donut */}
                          <div className="relative w-12 h-12">

                            <svg
                              className="w-12 h-12 transform -rotate-90"
                              viewBox="0 0 36 36"
                            >

                              <circle
                                cx="18"
                                cy="18"
                                r="15"
                                fill="none"
                                stroke="#f1f1f1"
                                strokeWidth="3"
                              />

                              <circle
                                cx="18"
                                cy="18"
                                r="15"
                                fill="none"
                                stroke="#D4A09A"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${match.score * 0.942} 100`}
                              />

                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center">

                              <span className="text-[10px] font-bold text-gray-600">
                                {match.score}%
                              </span>

                            </div>

                          </div>

                        </div>

                        {match.matched && (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-green-600">

                            <FaCheckCircle />

                            <span>
                              Your profile has relevant expertise
                            </span>

                          </div>
                        )}

                        {match.matchedSkills.length > 0 && (
                          <div className="mt-2">

                            <p className="text-[9px] uppercase tracking-wide text-gray-400 mb-1">
                              Matching skills
                            </p>

                            <div className="flex flex-wrap gap-1">

                              {match.matchedSkills
                                .slice(0, 3)
                                .map(
                                  (
                                    skill,
                                    index
                                  ) => (

                                    <span
                                      key={`${skill}-${index}`}
                                      className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[9px]"
                                    >
                                      {skill}
                                    </span>

                                  )
                                )}

                            </div>

                          </div>
                        )}

                      </div>

                      {/* Category and Status */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">

                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {problem.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded ${
                            problem.status ===
                            'Pending'
                              ? 'bg-yellow-50 text-yellow-600'
                              : problem.status ===
                                'Under Review'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-purple-50 text-purple-600'
                          }`}
                        >
                          {problem.status}
                        </span>

                      </div>

                      {/* AI required disciplines */}
                      {aiProcessed &&
                        disciplines.length >
                          0 && (

                          <div className="mb-3">

                            <div className="flex items-center gap-1.5 mb-1.5">

                              <FaUsers className="text-[#D4A09A] text-[10px]" />

                              <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-400">
                                AI Suggested Expertise
                              </span>

                            </div>

                            <div className="flex flex-wrap gap-1">

                              {disciplines
                                .slice(0, 4)
                                .map(
                                  (
                                    discipline,
                                    index
                                  ) => (

                                    <span
                                      key={`${discipline}-${index}`}
                                      className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px]"
                                    >
                                      {discipline}
                                    </span>

                                  )
                                )}

                            </div>

                          </div>

                        )}

                      {/* Technologies */}
                      {aiProcessed &&
                        technologies.length >
                          0 && (

                          <div className="mb-3">

                            <div className="flex items-center gap-1.5 mb-1.5">

                              <FaCodeBranch className="text-[#D4A09A] text-[10px]" />

                              <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-400">
                                Technologies
                              </span>

                            </div>

                            <div className="flex flex-wrap gap-1">

                              {technologies
                                .slice(0, 3)
                                .map(
                                  (
                                    technology,
                                    index
                                  ) => (

                                    <span
                                      key={`${technology}-${index}`}
                                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px]"
                                    >
                                      {technology}
                                    </span>

                                  )
                                )}

                            </div>

                          </div>

                        )}

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

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default FindProblems;