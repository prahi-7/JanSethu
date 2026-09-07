import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUniversity, 
  FaUsers, 
  FaUserGraduate, 
  FaProjectDiagram,
  FaClipboardCheck,
  FaChartBar,
  FaCog,
  FaHome,
  FaList,
  FaSearch,
  FaFilter,
  FaEye,
  FaPlus,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserTie,
  FaBuilding,
  FaBook,
  FaStar,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLink,
  FaExternalLinkAlt,
  FaTrash,
  FaEdit,
  FaEyeSlash,
  FaTimes
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const UniversityDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  
  // New Team Form State
  const [newTeam, setNewTeam] = useState({
    name: '',
    problem: '',
    description: '',
    maxMembers: 5,
  });

  // University Data - Will come from API
  const [universityData, setUniversityData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    totalStudents: 0,
    activeStudents: 0,
    activeTeams: 0,
    activeProjects: 0,
    problemsBeingWorked: 0,
    solutionsSubmitted: 0,
    totalCollaborations: 0,
  });

  // Mock Data - Will be replaced with API data
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [problems, setProblems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [branchParticipation, setBranchParticipation] = useState([]);
  const [crossUniversityTeams, setCrossUniversityTeams] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // ============ HANDLER FUNCTIONS ============
  
  // Handle View Students - Navigate to Students tab
  const handleViewStudents = () => {
    setActiveTab('students');
    toast.success('Showing students list');
  };

  // Handle Create Team
  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeam.name) {
      toast.error('Please enter team name');
      return;
    }
    // Add team logic here - will connect to API later
    toast.success(`Team "${newTeam.name}" created successfully! 🎉`);
    setShowCreateTeamModal(false);
    setNewTeam({ name: '', problem: '', description: '', maxMembers: 5 });
  };

  // Handle View Team
  const handleViewTeam = (teamId) => {
    toast.info('Team details coming soon!');
  };

  // Handle View Project
  const handleViewProject = (projectId) => {
    toast.info('Project details coming soon!');
  };

  // Handle View Problem
  const handleViewProblem = (problemId) => {
    toast.info('Problem details coming soon!');
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = filterBranch === 'all' || student.branch === filterBranch;
    const matchYear = filterYear === 'all' || student.year === filterYear;
    return matchSearch && matchBranch && matchYear;
  });

  // Filter teams
  const filteredTeams = teams.filter(team => {
    const matchSearch = team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       team.problem?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || team.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       project.problem?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Filter problems
  const filteredProblems = problems.filter(problem => {
    const matchSearch = problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       problem.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || problem.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Get unique values for filters
  const branches = ['all', ...new Set(students.map(s => s.branch).filter(Boolean))];
  const years = ['all', ...new Set(students.map(s => s.year).filter(Boolean))];
  const statuses = ['all', 'Active', 'In Progress', 'Completed', 'Pending', 'Solved'];

  // Get stats
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'Active').length,
    activeTeams: teams.filter(t => t.status === 'Active' || t.status === 'In Progress').length,
    activeProjects: projects.filter(p => p.status === 'In Progress' || p.status === 'Active').length,
    problemsBeingWorked: problems.filter(p => p.status === 'In Progress').length,
    solutionsSubmitted: projects.filter(p => p.status === 'Completed' || p.status === 'Solved').length,
  };

  // Tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaHome /> },
    { id: 'students', label: 'Students', icon: <FaUserGraduate /> },
    { id: 'teams', label: 'Teams', icon: <FaUsers /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram /> },
    { id: 'problems', label: 'Problems', icon: <FaList /> },
    { id: 'participation', label: 'Participation', icon: <FaChartBar /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FFF5F2] pt-16">
        <Sidebar role="university" />
        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading university dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render different tab content
  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'students':
        return renderStudents();
      case 'teams':
        return renderTeams();
      case 'projects':
        return renderProjects();
      case 'problems':
        return renderProblems();
      case 'participation':
        return renderParticipation();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  // ============ OVERVIEW TAB ============
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 hover:shadow-md transition-all">
          <p className="text-xs text-gray-400">Total Students</p>
          <p className="text-2xl font-bold text-[#D4A09A]">{stats.totalStudents}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 hover:shadow-md transition-all">
          <p className="text-xs text-gray-400">Active Students</p>
          <p className="text-2xl font-bold text-[#D4A09A]">{stats.activeStudents}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 hover:shadow-md transition-all">
          <p className="text-xs text-gray-400">Active Teams</p>
          <p className="text-2xl font-bold text-[#D4A09A]">{stats.activeTeams}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 hover:shadow-md transition-all">
          <p className="text-xs text-gray-400">Active Projects</p>
          <p className="text-2xl font-bold text-[#D4A09A]">{stats.activeProjects}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 hover:shadow-md transition-all">
          <p className="text-xs text-gray-400">Problems Being Worked</p>
          <p className="text-2xl font-bold text-[#D4A09A]">{stats.problemsBeingWorked}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 hover:shadow-md transition-all">
          <p className="text-xs text-gray-400">Solutions Submitted</p>
          <p className="text-2xl font-bold text-[#D4A09A]">{stats.solutionsSubmitted}</p>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">Welcome to University Dashboard</h2>
        <p className="text-gray-500">
          Manage your university's participation in JanSethu. Track students, teams, projects, and problems.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button 
            onClick={handleViewStudents}
            className="px-4 py-2 bg-[#FFCABE] text-[#8B5E5E] rounded-xl font-semibold hover:shadow-md transition-all flex items-center gap-2"
          >
            <FaUserGraduate /> View Students
          </button>
          <button 
            onClick={() => setShowCreateTeamModal(true)}
            className="px-4 py-2 bg-[#FFCABE] text-[#8B5E5E] rounded-xl font-semibold hover:shadow-md transition-all flex items-center gap-2"
          >
            <FaPlus /> Create Team
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaClock className="text-[#D4A09A]" /> Recent Activity
        </h2>
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FaClock className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs text-gray-300 mt-1">Activity will appear here once students start participating</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#FFF5F2] rounded-xl">
                <div className="w-10 h-10 bg-[#FFCABE] rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-[#8B5E5E]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ============ STUDENTS TAB ============
  const renderStudents = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg md:text-xl font-bold text-gray-700 flex items-center gap-2">
          <FaUserGraduate className="text-[#D4A09A]" /> Students ({students.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm w-full sm:w-48"
            />
          </div>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
          >
            <option value="all">All Branches</option>
            {branches.filter(b => b !== 'all').map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
          >
            <option value="all">All Years</option>
            {years.filter(y => y !== 'all').map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-8 md:p-12 text-center">
          <FaUserGraduate className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-base text-gray-500">No students registered yet</p>
          <p className="text-sm text-gray-400">Students will appear here once they join your university</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FFF5F2]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-[#FFF5F2] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.branch}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.year}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.team || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        student.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-200' :
                        'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                        {student.status || 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 text-[#D4A09A] hover:bg-[#FFF5F2] rounded transition-colors">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // ============ TEAMS TAB ============
  const renderTeams = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg md:text-xl font-bold text-gray-700 flex items-center gap-2">
          <FaUsers className="text-[#D4A09A]" /> Teams ({teams.length})
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-8 md:p-12 text-center">
          <FaUsers className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-base text-gray-500">No teams formed yet</p>
          <p className="text-sm text-gray-400">Teams will appear here once students start collaborating</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-700">{team.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  team.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-200' :
                  team.status === 'In Progress' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                  team.status === 'Completed' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                  'bg-gray-50 text-gray-500 border border-gray-200'
                }`}>
                  {team.status || 'Pending'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Problem: {team.problem || 'Not assigned'}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {team.members?.map((member, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-[#FFF5F2] rounded-full text-xs text-gray-600">
                    {member}
                  </span>
                ))}
              </div>
              {team.branches && team.branches.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {team.branches.map((branch, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs border border-blue-200">
                      {branch}
                    </span>
                  ))}
                </div>
              )}
              {team.universities && team.universities.length > 1 && (
                <div className="mt-2 text-xs text-[#D4A09A]">
                  🤝 {team.universities.join(' + ')}
                </div>
              )}
              <button 
                onClick={() => handleViewTeam(team.id)}
                className="mt-3 w-full bg-[#FFCABE] text-[#8B5E5E] py-1.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all"
              >
                View Team
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============ PROJECTS TAB ============
  const renderProjects = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg md:text-xl font-bold text-gray-700 flex items-center gap-2">
          <FaProjectDiagram className="text-[#D4A09A]" /> Projects ({projects.length})
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-8 md:p-12 text-center">
          <FaProjectDiagram className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-base text-gray-500">No projects started yet</p>
          <p className="text-sm text-gray-400">Projects will appear here once teams start working</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-700">{project.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  project.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-200' :
                  project.status === 'In Progress' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                  'bg-gray-50 text-gray-500 border border-gray-200'
                }`}>
                  {project.status || 'Not Started'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Problem: {project.problem}</p>
              <p className="text-sm text-gray-500">Team: {project.team}</p>
              {project.students && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.students.map((student, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                      {student}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#FFCABE] transition-all" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              {project.mentor && (
                <p className="text-xs text-gray-400 mt-2">👨‍🏫 Mentor: {project.mentor}</p>
              )}
              <button 
                onClick={() => handleViewProject(project.id)}
                className="mt-3 w-full bg-[#FFCABE] text-[#8B5E5E] py-1.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all"
              >
                View Project
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============ PROBLEMS TAB ============
  const renderProblems = () => (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-bold text-gray-700 flex items-center gap-2">
        <FaList className="text-[#D4A09A]" /> Problems Being Worked On ({problems.length})
      </h2>

      {problems.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-8 md:p-12 text-center">
          <FaList className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-base text-gray-500">No problems assigned yet</p>
          <p className="text-sm text-gray-400">Problems will appear here once teams start working on them</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredProblems.map((problem) => (
            <div key={problem.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-700">{problem.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  problem.status === 'Solved' ? 'bg-green-50 text-green-600 border border-green-200' :
                  problem.status === 'In Progress' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                  'bg-gray-50 text-gray-500 border border-gray-200'
                }`}>
                  {problem.status || 'Pending'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{problem.category}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-400 text-xs" /> {problem.location}
              </p>
              <p className="text-sm text-gray-500 mt-1">Team: {problem.team}</p>
              <button 
                onClick={() => handleViewProblem(problem.id)}
                className="mt-3 w-full bg-[#FFCABE] text-[#8B5E5E] py-1.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all"
              >
                View Problem
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============ PARTICIPATION TAB ============
  const renderParticipation = () => (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-bold text-gray-700 flex items-center gap-2">
        <FaChartBar className="text-[#D4A09A]" /> Participation & Engagement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Branch Participation */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6">
          <h3 className="font-semibold text-gray-700 mb-3">Branch Participation</h3>
          {branchParticipation.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No branch participation data available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {branchParticipation.map((branch, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{branch.name}</span>
                    <span className="text-gray-500">{branch.count} students</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#FFCABE] transition-all" 
                      style={{ width: `${branch.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cross-University Collaboration */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6">
          <h3 className="font-semibold text-gray-700 mb-3">Cross-University Collaboration</h3>
          {crossUniversityTeams.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No cross-university collaborations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {crossUniversityTeams.map((team, index) => (
                <div key={index} className="p-3 bg-[#FFF5F2] rounded-xl border border-[#FFCABE]">
                  <p className="text-sm font-medium text-gray-700">{team.name}</p>
                  <p className="text-xs text-gray-500">{team.universities?.join(' • ')}</p>
                  <p className="text-xs text-gray-400">Members: {team.members?.length || 0}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 text-center">
          <p className="text-xs text-gray-400">Total Students</p>
          <p className="text-xl font-bold text-[#D4A09A]">{students.length}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 text-center">
          <p className="text-xs text-gray-400">Active Students</p>
          <p className="text-xl font-bold text-[#D4A09A]">{students.filter(s => s.status === 'Active').length}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 text-center">
          <p className="text-xs text-gray-400">Active Teams</p>
          <p className="text-xl font-bold text-[#D4A09A]">{teams.filter(t => t.status === 'Active' || t.status === 'In Progress').length}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 text-center">
          <p className="text-xs text-gray-400">Active Projects</p>
          <p className="text-xl font-bold text-[#D4A09A]">{projects.filter(p => p.status === 'In Progress' || p.status === 'Active').length}</p>
        </div>
      </div>
    </div>
  );

  // ============ SETTINGS TAB ============
  const renderSettings = () => (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-bold text-gray-700 flex items-center gap-2">
        <FaCog className="text-[#D4A09A]" /> University Settings
      </h2>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Profile Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">University Name</label>
            <input
              type="text"
              value={universityData.name || user?.name || ''}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-700"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
            <input
              type="text"
              value={universityData.department || user?.department || ''}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-700"
              disabled
            />
          </div>
          <p className="text-xs text-gray-400">Profile settings will be available once backend is connected</p>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 bg-[#FFF5F2] rounded-xl text-center">
            <p className="text-xs text-gray-400">Total Students</p>
            <p className="text-lg font-bold text-[#D4A09A]">{students.length}</p>
          </div>
          <div className="p-3 bg-[#FFF5F2] rounded-xl text-center">
            <p className="text-xs text-gray-400">Total Teams</p>
            <p className="text-lg font-bold text-[#D4A09A]">{teams.length}</p>
          </div>
          <div className="p-3 bg-[#FFF5F2] rounded-xl text-center">
            <p className="text-xs text-gray-400">Total Projects</p>
            <p className="text-lg font-bold text-[#D4A09A]">{projects.length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FFF5F2] pt-16">
      <Sidebar role="university" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        {/* University Header */}
        <div className="bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] rounded-2xl shadow-sm p-4 md:p-6 mb-6 text-[#8B5E5E]">
          <div className="flex items-center gap-3 md:gap-4">
            <FaUniversity className="text-3xl md:text-4xl" />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                {universityData.name || user?.name || 'University'}
              </h1>
              {(universityData.department || user?.department) && (
                <p className="text-sm md:text-base text-[#8B5E5E]/80">
                  {universityData.department || user?.department}
                </p>
              )}
              <div className="flex flex-wrap gap-3 md:gap-4 mt-1 md:mt-2 text-xs md:text-sm">
                <span className="flex items-center gap-1">
                  <FaUserGraduate /> {stats.totalStudents} Total Students
                </span>
                <span className="flex items-center gap-1">
                  <FaUsers /> {stats.activeTeams} Active Teams
                </span>
                <span className="flex items-center gap-1">
                  <FaProjectDiagram /> {stats.activeProjects} Active Projects
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-2 mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                  setFilterBranch('all');
                  setFilterYear('all');
                  setFilterStatus('all');
                }}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#FFCABE] text-[#8B5E5E] shadow-sm'
                    : 'text-gray-600 hover:bg-[#FFF5F2] hover:text-[#D4A09A]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Render Content */}
        {renderContent()}

        {/* Create Team Modal */}
        {showCreateTeamModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#FFCABE]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                  <FaUsers className="text-[#D4A09A]" /> Create New Team
                </h2>
                <button 
                  onClick={() => setShowCreateTeamModal(false)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateTeam}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Team Name *</label>
                    <input
                      type="text"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      placeholder="e.g., Environmental Warriors"
                      className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Problem to Solve</label>
                    <input
                      type="text"
                      value={newTeam.problem}
                      onChange={(e) => setNewTeam({ ...newTeam, problem: e.target.value })}
                      placeholder="e.g., Water Quality Monitoring"
                      className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={newTeam.description}
                      onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                      placeholder="What kind of problems are you interested in?"
                      rows="2"
                      className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Max Members</label>
                    <select
                      value={newTeam.maxMembers}
                      onChange={(e) => setNewTeam({ ...newTeam, maxMembers: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                    >
                      {[3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} members</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateTeamModal(false)} 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-[#FFCABE] text-[#8B5E5E] py-2 rounded-xl font-semibold hover:shadow-md transition-all text-sm"
                  >
                    Create Team 🚀
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityDashboard;