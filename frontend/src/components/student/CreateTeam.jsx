import React, { useState } from 'react';
import {
  useNavigate,
  useLocation,
  useSearchParams
} from 'react-router-dom';

import {
  FaArrowLeft,
  FaUsers,
  FaSpinner,
  FaUserPlus,
  FaCheckCircle,
  FaUniversity,
  FaGraduationCap
} from 'react-icons/fa';

import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CreateTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const problemIdFromUrl = searchParams.get('problemId');

  const problemId =
    problemIdFromUrl ||
    location.state?.problemId ||
    location.state?.problem?._id ||
    location.state?.problem?.id ||
    null;

  const selectedProblem =
    location.state?.problem ||
    location.state?.selectedProblem ||
    null;

  console.log('🔎 Problem ID for team:', problemId);
  console.log('🔎 Selected problem:', selectedProblem);

  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [sendingInvitations, setSendingInvitations] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [teamCreated, setTeamCreated] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 6,
    skills: [],
    university: user?.university || ''
  });

  // ---------------------------------------------------------
  // FORM CHANGE
  // ---------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ---------------------------------------------------------
  // FETCH RECOMMENDED STUDENTS
  // ---------------------------------------------------------

  const fetchRecommendedStudents = async (createdProblemId) => {
    if (!createdProblemId) {
      console.warn(
        '⚠️ No problem ID available for recommendations'
      );
      return;
    }

    setLoadingRecommendations(true);

    try {
      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        return;
      }

      const url =
        `http://localhost:5000/api/student/problems/${createdProblemId}/recommended-students`;

      console.log(
        '🤖 Fetching recommended students:',
        url
      );

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(
        '📡 Recommendation API status:',
        response.status
      );

      const data = await response.json();

      console.log(
        '📥 Recommended students response:',
        data
      );

      if (!response.ok) {
        toast.error(
          data.message ||
          'Failed to get recommended students'
        );
        return;
      }

      if (data.success) {
        let students = [];

        if (Array.isArray(data.data)) {
          students = data.data;
        } else if (
          Array.isArray(data.data?.students)
        ) {
          students = data.data.students;
        } else if (
          Array.isArray(data.data?.recommendations)
        ) {
          students = data.data.recommendations;
        } else if (
          Array.isArray(data.recommendations)
        ) {
          students = data.recommendations;
        }

        console.log(
          '👥 Parsed recommended students:',
          students
        );

        setRecommendations(students);

        if (students.length > 0) {
          toast.success(
            `Found ${students.length} suitable students!`
          );
        } else {
          toast(
            'No suitable students found for this problem yet.'
          );
        }

      } else {
        toast.error(
          data.message ||
          'Could not load recommended students'
        );
      }

    } catch (error) {
      console.error(
        '❌ Error loading recommended students:',
        error
      );

      toast.error(
        'Could not load recommended students'
      );

    } finally {
      setLoadingRecommendations(false);
    }
  };

  // ---------------------------------------------------------
  // SELECT / UNSELECT STUDENT
  // ---------------------------------------------------------

  const toggleStudent = (studentId) => {
    if (!studentId) {
      return;
    }

    setSelectedStudents(prev => {

      if (prev.includes(studentId)) {
        return prev.filter(
          id => id !== studentId
        );
      }

      const maxInvites =
        Number(formData.maxMembers) - 1;

      if (prev.length >= maxInvites) {
        toast.error(
          `You can select a maximum of ${maxInvites} other students.`
        );

        return prev;
      }

      return [
        ...prev,
        studentId
      ];
    });
  };

  // ---------------------------------------------------------
  // CREATE TEAM
  // ---------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Team name is required');
      return;
    }

    setLoading(true);

    try {
      const token =
        localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        return;
      }

      console.log(
        '🚀 Creating team for problem:',
        problemId
      );

      const response = await fetch(
        'http://localhost:5000/api/student/teams',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            maxMembers: Number(formData.maxMembers),

            university:
              formData.university ||
              user?.university,

            problemId: problemId
          })
        }
      );

      const data =
        await response.json();

      console.log(
        '📥 Create team response:',
        data
      );

      if (!response.ok || !data.success) {
        toast.error(
          data.message ||
          'Failed to create team'
        );

        return;
      }

      toast.success(
        '✅ Team created successfully!'
      );

      /*
       * Support different backend response structures.
       */
      const teamData =
        data.data?.team ||
        data.team ||
        data.data;

      setCreatedTeam(teamData);

      setTeamCreated(true);

      // -----------------------------------------------------
      // GET AI RECOMMENDED STUDENTS
      // -----------------------------------------------------

      if (problemId) {
        console.log(
          '🤖 Loading recommendations for problem:',
          problemId
        );

        await fetchRecommendedStudents(
          problemId
        );

      } else {
        console.warn(
          '⚠️ Team created, but no problemId was found.'
        );

        toast(
          'Team created. No problem ID was available for recommendations.'
        );
      }

    } catch (error) {
      console.error(
        '❌ Error creating team:',
        error
      );

      toast.error(
        'Failed to create team'
      );

    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // SEND TEAM INVITATIONS
  // ---------------------------------------------------------

  const handleSendInvitations = async () => {
    if (selectedStudents.length === 0) {
      toast.error(
        'Please select at least one student.'
      );
      return;
    }

    if (!problemId) {
      toast.error(
        'Problem information is missing.'
      );
      return;
    }

    /*
     * Get the actual created Team ID.
     *
     * Supports several possible backend response formats.
     */
    const teamId =
      createdTeam?._id ||
      createdTeam?.id ||
      createdTeam?.team?._id ||
      createdTeam?.team?.id;

    if (!teamId) {
      console.error(
        '❌ Created team ID not found:',
        createdTeam
      );

      toast.error(
        'Team ID could not be found. Please try again.'
      );

      return;
    }

    setSendingInvitations(true);

    try {
      const token =
        localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        return;
      }

      console.log(
        '📨 Sending invitations...',
        {
          problemId,
          teamId,
          selectedStudents
        }
      );

      let successCount = 0;
      let failureCount = 0;

      for (const studentId of selectedStudents) {
        const student =
          recommendations.find(item => {

            const id =
              item.studentId ||
              item._id ||
              item.id;

            return id?.toString() ===
              studentId?.toString();
          });

        const matchScore =
          getMatchPercentage(student);

        const matchedSkills =
          student?.match?.matchedSkills ||
          student?.matchedSkills ||
          student?.match?.skills ||
          [];

        const reason =
          student?.match?.reason ||
          student?.reason ||
          '';

        try {
          const response =
            await fetch(
              'http://localhost:5000/api/student/team-invitations',
              {
                method: 'POST',

                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    `Bearer ${token}`
                },

                body: JSON.stringify({
                  problemId,
                  teamId,
                  receiverId: studentId,
                  matchScore,
                  matchedSkills,
                  reason
                })
              }
            );

          const data =
            await response.json();

          console.log(
            `📩 Invitation response for ${studentId}:`,
            data
          );

          if (response.ok && data.success) {
            successCount++;
          } else {
            failureCount++;

            console.warn(
              `⚠️ Failed to invite ${studentId}:`,
              data.message
            );
          }

        } catch (error) {
          failureCount++;

          console.error(
            `❌ Error inviting student ${studentId}:`,
            error
          );
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} invitation${
            successCount > 1 ? 's' : ''
          } sent successfully!`
        );
      }

      if (failureCount > 0) {
        toast.error(
          `${failureCount} invitation${
            failureCount > 1 ? 's' : ''
          } could not be sent.`
        );
      }

      /*
       * Clear successfully processed selections.
       * Keep failed selections so they can be retried.
       */
      if (failureCount === 0) {
        setSelectedStudents([]);

        setTimeout(() => {
          navigate('/student/teams');
        }, 1200);
      }

    } catch (error) {
      console.error(
        '❌ Send invitations error:',
        error
      );

      toast.error(
        'Failed to send invitations'
      );

    } finally {
      setSendingInvitations(false);
    }
  };

  // ---------------------------------------------------------
  // CONTINUE WITHOUT INVITING
  // ---------------------------------------------------------

  const handleContinueWithoutInviting = () => {
    navigate('/student/teams');
  };

  // ---------------------------------------------------------
  // MATCH PERCENTAGE
  // ---------------------------------------------------------

  const getMatchPercentage = (student) => {
    if (
      typeof student?.match?.percentage ===
      'number'
    ) {
      return Math.round(
        student.match.percentage
      );
    }

    if (
      typeof student?.match?.score ===
      'number'
    ) {
      return Math.round(
        student.match.score
      );
    }

    if (
      typeof student?.matchPercentage ===
      'number'
    ) {
      return Math.round(
        student.matchPercentage
      );
    }

    if (
      typeof student?.matchScore ===
      'number'
    ) {
      return Math.round(
        student.matchScore
      );
    }

    return 0;
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar
        role={user?.role || 'student'}
      />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-2xl mx-auto">

          {/* BACK */}

          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-[#D4A09A] transition-colors flex items-center gap-2 mb-4"
          >
            <FaArrowLeft />
            Back
          </button>

          {/* =================================================
              CREATE TEAM FORM
          ================================================= */}

          {!teamCreated && (

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 bg-[#FFCABE] rounded-xl flex items-center justify-center">

                  <FaUsers className="text-[#8B5E5E] text-xl" />

                </div>

                <div>

                  <h1 className="text-2xl font-bold text-gray-700">
                    Create New Team
                  </h1>

                  <p className="text-sm text-gray-400">
                    Build your team for solving problems
                  </p>

                </div>

              </div>

              {/* SELECTED PROBLEM */}

              {selectedProblem && (

                <div className="mb-6 p-4 bg-[#FFF5F2] border border-[#FFCABE] rounded-xl">

                  <p className="text-xs font-semibold text-[#8B5E5E] uppercase mb-1">
                    Problem you are solving
                  </p>

                  <p className="font-semibold text-gray-700">
                    {selectedProblem.title ||
                      selectedProblem.name ||
                      'Selected Problem'}
                  </p>

                  {selectedProblem.category && (
                    <p className="text-sm text-gray-500 mt-1">
                      Category:{' '}
                      {selectedProblem.category}
                    </p>
                  )}

                </div>

              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* TEAM NAME */}

                <div>

                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Team Name{' '}
                    <span className="text-red-400">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter team name"
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
                    required
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="What is your team about?"
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
                  />

                </div>

                {/* MAX MEMBERS */}

                <div>

                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Max Members
                  </label>

                  <select
                    name="maxMembers"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
                  >

                    {[2, 3, 4, 5, 6].map(
                      num => (
                        <option
                          key={num}
                          value={num}
                        >
                          {num} members
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* UNIVERSITY */}

                {user?.role === 'university' && (

                  <div>

                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      University
                    </label>

                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      placeholder="University name"
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
                    />

                  </div>

                )}

                {/* BUTTONS */}

                <div className="flex gap-3 pt-4">

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >

                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Creating Team...
                      </>
                    ) : (
                      'Create Team'
                    )}

                  </button>

                </div>

              </form>

            </div>

          )}

          {/* =================================================
              RECOMMENDED STUDENTS
          ================================================= */}

          {teamCreated && (

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

              {/* HEADER */}

              <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 bg-[#FFCABE] rounded-xl flex items-center justify-center">

                  <FaUserPlus className="text-[#8B5E5E] text-xl" />

                </div>

                <div>

                  <h1 className="text-2xl font-bold text-gray-700">
                    Recommended Students
                  </h1>

                  <p className="text-sm text-gray-400">
                    Choose students you want to invite to your team
                  </p>

                </div>

              </div>

              {/* TEAM CREATED */}

              <div className="mb-5 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">

                <FaCheckCircle className="text-green-500 mt-1" />

                <div>

                  <p className="font-semibold text-gray-700">
                    Team created successfully
                  </p>

                  <p className="text-sm text-gray-500">
                    You are the team leader. Select suitable students below if you want to invite them.
                  </p>

                </div>

              </div>

              {/* PROBLEM */}

              {selectedProblem && (

                <div className="mb-5 p-4 bg-[#FFF5F2] rounded-xl">

                  <p className="text-xs font-semibold text-[#8B5E5E] uppercase mb-1">
                    Problem
                  </p>

                  <p className="font-semibold text-gray-700">
                    {selectedProblem.title ||
                      selectedProblem.name ||
                      'Selected Problem'}
                  </p>

                </div>

              )}

              {/* LOADING */}

              {loadingRecommendations && (

                <div className="py-10 flex flex-col items-center justify-center text-gray-400">

                  <FaSpinner className="animate-spin text-2xl mb-3" />

                  <p>
                    AI is finding suitable students...
                  </p>

                </div>

              )}

              {/* NO RECOMMENDATIONS */}

              {!loadingRecommendations &&
                recommendations.length === 0 && (

                  <div className="py-8 text-center">

                    <FaUsers className="mx-auto text-4xl text-gray-300 mb-3" />

                    <p className="text-gray-500">
                      No recommended students found right now.
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      You can continue and invite students later.
                    </p>

                  </div>

                )}

              {/* RECOMMENDATIONS */}

              {!loadingRecommendations &&
                recommendations.length > 0 && (

                  <div className="space-y-3">

                    <div className="flex items-center justify-between mb-3">

                      <p className="text-sm font-semibold text-gray-600">
                        AI Recommended Students
                      </p>

                      <p className="text-xs text-gray-400">
                        {selectedStudents.length}/
                        {Number(formData.maxMembers) - 1}
                        {' '}selected
                      </p>

                    </div>

                    {recommendations.map(
                      (student, index) => {

                        const studentId =
                          student.studentId ||
                          student._id ||
                          student.id;

                        const matchPercentage =
                          getMatchPercentage(student);

                        const isSelected =
                          selectedStudents.includes(
                            studentId
                          );

                        return (

                          <div
                            key={
                              studentId ||
                              index
                            }
                            className={`border rounded-xl p-4 transition-all ${
                              isSelected
                                ? 'border-[#E8B5A9] bg-[#FFF5F2]'
                                : 'border-gray-200 bg-white/70'
                            }`}
                          >

                            <div className="flex items-start justify-between gap-4">

                              {/* STUDENT INFO */}

                              <div className="flex items-start gap-3">

                                <div className="w-11 h-11 rounded-full bg-[#FFCABE] flex items-center justify-center flex-shrink-0">

                                  <FaGraduationCap className="text-[#8B5E5E]" />

                                </div>

                                <div>

                                  <p className="font-semibold text-gray-700">
                                    {student.name ||
                                      'Student'}
                                  </p>

                                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">

                                    <FaUniversity className="text-xs" />

                                    <span>
                                      {student.university ||
                                        'University not specified'}
                                    </span>

                                  </div>

                                  <p className="text-sm text-gray-500 mt-1">

                                    {student.department ||
                                      'Department not specified'}

                                    {student.year
                                      ? ` • Year ${student.year}`
                                      : ''}

                                  </p>

                                  {/* MATCH REASON */}

                                  {student.match?.reason && (

                                    <p className="text-xs text-gray-400 mt-2">
                                      {student.match.reason}
                                    </p>

                                  )}

                                </div>

                              </div>

                              {/* MATCH */}

                              <div className="text-right flex-shrink-0">

                                <p className="text-lg font-bold text-[#8B5E5E]">
                                  {matchPercentage}%
                                </p>

                                <p className="text-xs text-gray-400">
                                  match
                                </p>

                              </div>

                            </div>

                            {/* SELECT BUTTON */}

                            <button
                              type="button"
                              onClick={() =>
                                toggleStudent(
                                  studentId
                                )
                              }
                              disabled={!studentId}
                              className={`mt-3 w-full py-2 rounded-lg font-medium transition-colors ${
                                isSelected
                                  ? 'bg-[#E8B5A9] text-white'
                                  : 'border border-[#E8B5A9] text-[#8B5E5E] hover:bg-[#FFF5F2]'
                              }`}
                            >

                              {isSelected
                                ? '✓ Selected'
                                : 'Select Student'}

                            </button>

                          </div>

                        );
                      }
                    )}

                  </div>

                )}

              {/* BOTTOM BUTTONS */}

              <div className="flex gap-3 pt-6">

                <button
                  type="button"
                  onClick={
                    handleContinueWithoutInviting
                  }
                  disabled={sendingInvitations}
                  className="px-5 py-3 border border-gray-300 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Continue Later
                </button>

                <button
                  type="button"
                  onClick={
                    handleSendInvitations
                  }
                  disabled={
                    selectedStudents.length === 0 ||
                    sendingInvitations
                  }
                  className="flex-1 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >

                  {sendingInvitations ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending Invitations...
                    </>
                  ) : (
                    'Send Invitations'
                  )}

                </button>

              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                AI only recommends students. You decide who to invite.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default CreateTeam;