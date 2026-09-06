import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaClock, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaArrowRight
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const MyProblems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = problems;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProblems(filtered);
  }, [searchTerm, filterStatus, problems]);

  const getStatusBadge = (status) => {
    const map = {
      'Solved': { color: 'bg-green-50 text-green-600 border-green-200', icon: <FaCheckCircle className="mr-1" /> },
      'In Progress': { color: 'bg-yellow-50 text-yellow-600 border-yellow-200', icon: <FaClock className="mr-1" /> },
      'Under Review': { color: 'bg-blue-50 text-blue-600 border-blue-200', icon: <FaEye className="mr-1" /> },
      'Pending': { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: <FaTimesCircle className="mr-1" /> },
      'Escalated': { color: 'bg-red-50 text-red-600 border-red-200', icon: <FaExclamationTriangle className="mr-1" /> },
    };
    return map[status] || map['Pending'];
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-400';
    if (progress >= 50) return 'bg-yellow-400';
    if (progress >= 20) return 'bg-blue-400';
    return 'bg-gray-300';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="citizen" />
        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FFCABE] border-t-[#FFCABE] rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="citizen" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">My Problems</h1>
        <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Track all the problems you've reported</p>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under review">Under Review</option>
                <option value="in progress">In Progress</option>
                <option value="solved">Solved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaCheckCircle className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No problems found</p>
            <p className="text-sm text-gray-400 mt-1">Start by reporting a problem</p>
            <Link to="/citizen/report" className="inline-block mt-3 md:mt-4 text-[#FFCABE] hover:text-pink-700 font-medium">
              Report a new problem →
            </Link>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredProblems.map((problem) => {
              const badge = getStatusBadge(problem.status);
              return (
                <Link key={problem.id} to={`/citizen/problem/${problem.id}`} className="block bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all hover:border-[#FFCABE]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-700 text-sm md:text-base">{problem.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs flex items-center border ${badge.color}`}>
                          {badge.icon} {problem.status}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-400 mb-1">{problem.category}</p>
                      <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{problem.description}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-[10px] md:text-xs text-gray-400">
                        <span>📅 {problem.date}</span>
                        <span>👤 {problem.assignedTo}</span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          problem.priority === 'High' ? 'bg-red-50 text-red-500 border border-red-200' :
                          problem.priority === 'Medium' ? 'bg-yellow-50 text-yellow-500 border border-yellow-200' :
                          'bg-blue-50 text-blue-500 border border-blue-200'
                        }`}>
                          {problem.priority} Priority
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[100px] md:min-w-[120px]">
                      <div className="w-full">
                        <div className="flex justify-between text-[10px] md:text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{problem.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${getProgressColor(problem.progress)}`} style={{ width: `${problem.progress}%` }}></div>
                        </div>
                      </div>
                      <span className="text-[#FFCABE] text-xs md:text-sm flex items-center">
                        View Details <FaArrowRight className="ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProblems;