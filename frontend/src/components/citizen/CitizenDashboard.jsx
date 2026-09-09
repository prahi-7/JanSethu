import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaExclamationTriangle, FaCheckCircle, FaClock, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
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

  useEffect(() => {
    if (user?._id) {
      fetchProblems();
    }
  }, [user]);

  const updateStats = (problemsList) => {
    const stats = {
      total: problemsList.length,
      pending: problemsList.filter(p => p.status === 'Pending').length,
      inProgress: problemsList.filter(p => p.status === 'In Progress' || p.status === 'Under Review').length,
      solved: problemsList.filter(p => p.status === 'Solved').length
    };
    setStats(stats);
  };

  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        toast.error('Please login again');
        setIsLoading(false);
        return;
      }

      console.log('🔍 Fetching problems for user:', user._id);
      
      // Try citizen-specific endpoint
      let response = await fetch(`http://localhost:5000/api/problems/citizen/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      let data = await response.json();
      console.log('📥 Citizen endpoint response:', data);
      
      // If citizen endpoint fails or returns empty, try all problems
      if (!data.success || (data.data?.data?.length === 0 && data.data?.length === 0)) {
        console.log('🔄 Trying fallback: fetching all problems');
        response = await fetch(`http://localhost:5000/api/problems`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        data = await response.json();
        console.log('📥 All problems response:', data);
        
        if (data.success) {
          const allProblems = data.data.data || data.data || [];
          // Filter by citizen ID
          const citizenProblems = allProblems.filter(p => 
            p.citizen?._id === user._id || 
            p.citizen === user._id ||
            p.citizenId === user._id
          );
          console.log('📊 Filtered problems:', citizenProblems);
          setProblems(citizenProblems);
          updateStats(citizenProblems);
          return;
        }
      }
      
      if (data.success) {
        const problemsList = data.data.data || data.data || [];
        setProblems(problemsList);
        updateStats(problemsList);
      } else {
        toast.error(data.message || 'Failed to load problems');
      }
    } catch (error) {
      console.error('❌ Error fetching problems:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Solved': return 'text-green-500 bg-green-50';
      case 'Pending': return 'text-yellow-500 bg-yellow-50';
      case 'Under Review': return 'text-blue-500 bg-blue-50';
      case 'In Progress': return 'text-purple-500 bg-purple-50';
      case 'Rejected': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Solved': return <FaCheckCircle />;
      case 'Pending': return <FaClock />;
      case 'Rejected': return <FaExclamationTriangle />;
      default: return <FaClock />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="citizen" />
        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your problems...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="citizen" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">My Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome back, {user?.name}!</p>
            </div>
            <Link
              to="/citizen/report"
              className="mt-3 md:mt-0 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <FaPlus /> Report New Problem
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-yellow-100">
              <p className="text-yellow-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
              <p className="text-purple-500 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-purple-500">{stats.inProgress}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-100">
              <p className="text-green-500 text-sm">Solved</p>
              <p className="text-2xl font-bold text-green-500">{stats.solved}</p>
            </div>
          </div>

          {/* Problems List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">My Problems</h2>
            
            {problems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-400">No problems reported yet</p>
                <Link
                  to="/citizen/report"
                  className="inline-block mt-3 text-[#D4A09A] hover:text-[#8B5E5E] font-medium"
                >
                  Report your first problem →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {problems.map((problem) => (
                  <Link
                    key={problem._id}
                    to={`/citizen/problem/${problem._id}`}
                    className="block bg-white hover:shadow-md transition-shadow rounded-xl p-4 border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-700">{problem.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-1">{problem.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{problem.category}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            {new Date(problem.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          {problem.location?.address && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-[#D4A09A]" size={10} />
                                {problem.location.address}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(problem.status)}`}>
                          {getStatusIcon(problem.status)}
                          {problem.status}
                        </span>
                        <FaEye className="text-gray-300 hover:text-[#D4A09A] transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;