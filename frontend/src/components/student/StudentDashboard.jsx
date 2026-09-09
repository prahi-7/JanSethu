import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { 
  FaHome, 
  FaSearch, 
  FaProjectDiagram, 
  FaBook, 
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaComments,
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaHandshake,
  FaUniversity,
  FaUserGraduate,
  FaArrowLeft
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const location = useLocation();
  const student = location.state?.student;

  if (!student) {
    return <Navigate to="/university/login" replace />;
  }

  const [stats] = useState({
    inProgress: 0,
    solved: 0,
    totalProjects: 0,
    teamMembers: 0,
  });

  const [inProgressProjects] = useState([]);
  const [solvedProjects] = useState([]);
  const [availableProblems] = useState([]);

  const handleAcceptProblem = () => toast.success('Problem accepted successfully! 🎉');
  const handleFormTeam = () => toast.success('Team formation request sent! 🎉');
  const handleChat = () => toast.success('Opening chat... 💬');

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <Link to="/university/dashboard" className="inline-flex items-center gap-2 text-[#FFCABE] hover:text-pink-700 mb-3 md:mb-4 text-sm group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to University
        </Link>

        <div className="bg-gradient-to-r from-[#FFCABE] via-[#E8B5A9] to-purple-500 rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold text-white border-4 border-white/50">
              {student.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{student.name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 mt-1 md:mt-2 text-xs md:text-sm text-white/80">
                <span className="flex items-center gap-2"><FaEnvelope /> {student.email}</span>
                <span className="flex items-center gap-2"><FaIdCard /> Reg No: {student.regNo}</span>
                <span className="flex items-center gap-2"><FaUniversity /> {student.university || 'University not provided'}</span>
                <span className="flex items-center gap-2"><FaUserGraduate /> {student.department || 'Department not provided'}</span>
                <span className="flex items-center gap-2"><FaClock /> {student.year || 'Year not provided'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleFormTeam} className="px-3 md:px-4 py-1.5 md:py-2 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 text-sm md:text-base border border-white/30">
                <FaUserPlus /> Form Team
              </button>
              <Link to="/student/teams" className="px-3 md:px-4 py-1.5 md:py-2 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 text-sm md:text-base border border-white/30">
                <FaUsers /> Teams
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">In Progress</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">{stats.inProgress}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">Solved</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">{stats.solved}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">Total Projects</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">{stats.totalProjects}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">Team Members</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-500">{stats.teamMembers}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
          <Link to="/student/find-problems" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-[#FFCABE] transition-all text-center">
            <FaSearch className="text-xl md:text-2xl text-pink-400 mx-auto mb-1" />
            <p className="text-[10px] md:text-sm font-semibold text-gray-600">Find Problems</p>
          </Link>
          <Link to="/student/teams" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-green-200 transition-all text-center">
            <FaUsers className="text-xl md:text-2xl text-green-400 mx-auto mb-1" />
            <p className="text-[10px] md:text-sm font-semibold text-gray-600">My Teams</p>
          </Link>
          <Link to="/student/teams" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-purple-200 transition-all text-center">
            <FaComments className="text-xl md:text-2xl text-purple-400 mx-auto mb-1" />
            <p className="text-[10px] md:text-sm font-semibold text-gray-600">Team Chat</p>
          </Link>
          <Link to="/student/solution-library" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md hover:border-orange-200 transition-all text-center">
            <FaBook className="text-xl md:text-2xl text-orange-400 mx-auto mb-1" />
            <p className="text-[10px] md:text-sm font-semibold text-gray-600">Solution Library</p>
          </Link>
        </div>

        {inProgressProjects.length === 0 && solvedProjects.length === 0 && availableProblems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center">
            <FaProjectDiagram className="text-4xl md:text-6xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No projects assigned yet</p>
            <Link to="/student/find-problems" className="inline-block mt-2 md:mt-3 text-[#FFCABE] hover:text-pink-700 text-sm md:text-base">
              Find problems to solve →
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaClock className="text-yellow-500" /> In Progress ({inProgressProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {inProgressProjects.map((project) => (
                  <div key={project.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all border-l-4 border-l-yellow-400">
                    {/* Project details */}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Solved ({solvedProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {solvedProjects.map((project) => (
                  <div key={project.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all border-l-4 border-l-green-400">
                    {/* Project details */}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaHandshake className="text-[#FFCABE]" /> Available to Accept
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {availableProblems.map((problem) => (
                  <div key={problem.id} className="border border-gray-200 rounded-xl p-3 md:p-4 hover:shadow-md transition-all hover:border-[#FFCABE]">
                    {/* Problem details */}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;