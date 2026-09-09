import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUniversity, FaUsers, FaProjectDiagram, FaPlus, 
  FaEye, FaSpinner, FaUserGraduate, FaBriefcase,
  FaCalendarAlt, FaCheckCircle, FaClock
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const UniversityDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeams: 0,
    totalProjects: 0,
    activeProjects: 0
  });

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      // Fetch students from this university
      const studentsRes = await fetch(`http://localhost:5000/api/university/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const studentsData = await studentsRes.json();
      console.log('📥 Students data:', studentsData);
      
      if (studentsData.success) {
        const studentsList = studentsData.data.data || studentsData.data || [];
        setStudents(studentsList);
        setStats(prev => ({ ...prev, totalStudents: studentsList.length }));
      }

      // Fetch teams from this university
      const teamsRes = await fetch(`http://localhost:5000/api/student/teams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const teamsData = await teamsRes.json();
      console.log('📥 Teams data:', teamsData);
      
      if (teamsData.success) {
        const teamsList = teamsData.data.data || teamsData.data || [];
        setTeams(teamsList);
        setStats(prev => ({ 
          ...prev, 
          totalTeams: teamsList.length,
          activeProjects: teamsList.filter(t => t.status === 'Active').length
        }));
      }

      // Fetch projects
      const projectsRes = await fetch(`http://localhost:5000/api/student/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const projectsData = await projectsRes.json();
      console.log('📥 Projects data:', projectsData);
      
      if (projectsData.success) {
        const projectsList = projectsData.data.data || projectsData.data || [];
        setProjects(projectsList);
        setStats(prev => ({ ...prev, totalProjects: projectsList.length }));
      }

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="university" />
        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-[#FFCABE] mx-auto" />
            <p className="mt-4 text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="university" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                <FaUniversity className="inline-block text-[#D4A09A] mr-2" />
                {user?.university || user?.name || 'University'} Dashboard
              </h1>
              <p className="text-gray-400 text-sm">Manage your university's students, teams, and projects</p>
            </div>
            {/* ✅ FIXED: Use the correct route path */}
            <Link
              to="/student/teams/create"
              className="mt-3 md:mt-0 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <FaPlus /> Create Team
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <FaUserGraduate className="text-blue-400" /> Students
              </p>
              <p className="text-2xl font-bold text-gray-700">{stats.totalStudents}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <FaUsers className="text-purple-400" /> Teams
              </p>
              <p className="text-2xl font-bold text-purple-500">{stats.totalTeams}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-100">
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <FaProjectDiagram className="text-green-400" /> Projects
              </p>
              <p className="text-2xl font-bold text-green-500">{stats.totalProjects}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-yellow-100">
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <FaCheckCircle className="text-yellow-400" /> Active
              </p>
              <p className="text-2xl font-bold text-yellow-500">{stats.activeProjects}</p>
            </div>
          </div>

          {/* Teams List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaUsers className="text-[#D4A09A]" /> Teams
              </h2>
              <Link to="/student/teams" className="text-sm text-[#D4A09A] hover:text-[#8B5E5E]">
                View All →
              </Link>
            </div>
            
            {teams.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🤝</div>
                <p className="text-gray-400">No teams created yet</p>
                <Link to="/student/teams/create" className="inline-block mt-2 text-[#D4A09A] hover:text-[#8B5E5E] text-sm">
                  Create your first team →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teams.slice(0, 4).map((team) => (
                  <Link
                    key={team._id}
                    to={`/student/teams/${team._id}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all hover:border-[#FFCABE]"
                  >
                    <h3 className="font-semibold text-gray-700">{team.name}</h3>
                    <p className="text-xs text-gray-400">Members: {team.members?.length || 0}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        team.status === 'Active' ? 'bg-green-50 text-green-600' :
                        team.status === 'Forming' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {team.status || 'Forming'}
                      </span>
                      <span className="text-xs text-gray-400">
                        <FaCalendarAlt className="inline mr-1" />
                        {new Date(team.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Students */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaUserGraduate className="text-[#D4A09A]" /> Recent Students
              </h2>
              <Link to="/university/students" className="text-sm text-[#D4A09A] hover:text-[#8B5E5E]">
                View All →
              </Link>
            </div>
            
            {students.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎓</div>
                <p className="text-gray-400">No students registered yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.slice(0, 5).map((student) => (
                  <div key={student._id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-700">{student.name}</p>
                      <p className="text-xs text-gray-400">{student.department || 'No department'}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {student.year || 'Year N/A'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;