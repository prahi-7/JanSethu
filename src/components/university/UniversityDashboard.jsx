import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaClock, 
  FaUniversity,
  FaUsers,
  FaStar,
  FaEnvelope,
  FaIdCard,
  FaSignInAlt,
  FaUser,
  FaUserPlus,
  FaArrowRight
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const UniversityDashboard = () => {
  const navigate = useNavigate();
  const [studentLoginData, setStudentLoginData] = useState({
    name: '',
    email: '',
    regNo: '',
    department: '',
    year: '',
  });

  const [stats] = useState({
    solved: 0,
    inProgress: 0,
    totalStudents: 0,
    totalTeams: 0,
  });

  const [solvedProblems] = useState([]);
  const [inProgressProblems] = useState([]);

  const handleStudentLogin = (e) => {
    e.preventDefault();
    const { name, email, regNo } = studentLoginData;
    if (!name || !email || !regNo) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const student = {
      name: name,
      email: email,
      regNo: regNo,
      department: studentLoginData.department || 'Computer Science Engineering',
      year: studentLoginData.year || '3rd Year',
      university: 'IIT Dhanbad',
    };
    
    toast.success(`Welcome ${name}! 🎉`);
    navigate('/student/dashboard', { state: { student: student } });
  };

  const handleChange = (e) => {
    setStudentLoginData({ ...studentLoginData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="university" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        {/* University Header */}
        <div className="bg-gradient-to-r from-[#FFCABE] via-[#E8B5A9] to-purple-500 rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 text-white">
          <div className="flex items-center gap-3 md:gap-4">
            <FaUniversity className="text-4xl md:text-5xl" />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">IIT Dhanbad</h1>
              <p className="text-xs md:text-sm text-white/80">Computer Science Engineering Department</p>
              <div className="flex flex-wrap gap-3 md:gap-4 mt-1 md:mt-2 text-xs md:text-sm">
                <span className="flex items-center gap-1"><FaCheckCircle /> {stats.solved} Solved</span>
                <span className="flex items-center gap-1"><FaClock /> {stats.inProgress} In Progress</span>
                <span className="flex items-center gap-1"><FaUsers /> {stats.totalStudents} Students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Problems Solved</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">{stats.solved}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">In Progress</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">{stats.inProgress}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Total Students</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">{stats.totalStudents}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all">
            <p className="text-[10px] md:text-sm text-gray-400">Active Teams</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-500">{stats.totalTeams}</p>
          </div>
        </div>

        {/* Student Login Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
            <FaSignInAlt className="text-[#FFCABE]" /> Student Login
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">Login to access your projects, teams, and chat</p>
          
          <form onSubmit={handleStudentLogin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={studentLoginData.name}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={studentLoginData.email}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Register No *</label>
              <input
                type="text"
                name="regNo"
                placeholder="Enter Registration No"
                value={studentLoginData.regNo}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Department</label>
              <input
                type="text"
                name="department"
                placeholder="Enter department"
                value={studentLoginData.department}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Year of Study</label>
              <select
                name="year"
                value={studentLoginData.year}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2 md:py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-[#FFCABE]/20"
              >
                <FaSignInAlt /> Login
              </button>
            </div>
          </form>
          <div className="mt-3 md:mt-4 text-center">
            <Link
              to="/university/register"
              className="text-[#FFCABE] hover:text-pink-700 text-xs md:text-sm font-medium"
            >
              New Student? Register here →
            </Link>
          </div>
        </div>

        {/* Problems Section */}
        {solvedProblems.length === 0 && inProgressProblems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center">
            <FaUniversity className="text-4xl md:text-6xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No problems assigned to this university yet</p>
            <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">Students can find and accept problems to work on</p>
            <Link to="/student/find-problems" className="inline-block mt-3 md:mt-4 text-[#FFCABE] hover:text-pink-700 text-sm md:text-base">
              Find problems to solve →
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 md:mb-8">
              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Solved Problems ({solvedProblems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {solvedProblems.map((problem) => (
                  <div key={problem.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all border-l-4 border-l-green-400">
                    <h3 className="font-bold text-gray-700">{problem.title}</h3>
                    <p className="text-sm text-gray-500">{problem.category}</p>
                    <p className="text-xs text-gray-400">Solved by: {problem.solvedBy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaClock className="text-yellow-500" /> In Progress ({inProgressProblems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {inProgressProblems.map((problem) => (
                  <div key={problem.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all border-l-4 border-l-yellow-400">
                    <h3 className="font-bold text-gray-700">{problem.title}</h3>
                    <p className="text-sm text-gray-500">{problem.category}</p>
                    <p className="text-xs text-gray-400">Team: {problem.team}</p>
                    <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${problem.progress}%` }}></div>
                    </div>
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

export default UniversityDashboard;