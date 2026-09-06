import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowLeft,
  FaPlus
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const ManageProblems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [problems, setProblems] = useState([]);

  const getStatusBadge = (status) => {
    const map = {
      'Solved': 'bg-green-50 text-green-600 border-green-200',
      'In Progress': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'Under Review': 'bg-blue-50 text-blue-600 border-blue-200',
      'Pending': 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return map[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      toast.success('Problem deleted successfully');
    }
  };

  const handleAssign = (id) => {
    toast.success('Team assigned successfully!');
  };

  if (problems.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="admin" />
        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Manage Problems</h1>
              <p className="text-sm md:text-base text-gray-400">View and manage all reported problems</p>
            </div>
            <button className="bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm shadow-[#FFCABE]">
              <FaPlus /> Add Problem
            </button>
          </div>

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
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaCheckCircle className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No problems reported yet</p>
            <p className="text-sm text-gray-400 mt-1">Problems will appear here once citizens start reporting</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Manage Problems</h1>
            <p className="text-sm md:text-base text-gray-400">View and manage all reported problems</p>
          </div>
          <button className="bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm shadow-[#FFCABE]">
            <FaPlus /> Add Problem
          </button>
        </div>

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

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FFF5F2]/50">
                <tr>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {problems.map((problem) => (
                  <tr key={problem.id} className="hover:bg-[#FFF5F2]/30 transition-colors">
                    <td className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700">{problem.title}</td>
                    <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-500">{problem.category}</td>
                    <td className="px-3 md:px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border ${getStatusBadge(problem.status)}`}>
                        {problem.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold ${
                        problem.priority === 'High' ? 'bg-red-50 text-red-500 border border-red-200' :
                        problem.priority === 'Medium' ? 'bg-yellow-50 text-yellow-500 border border-yellow-200' :
                        'bg-blue-50 text-blue-500 border border-blue-200'
                      }`}>
                        {problem.priority}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-500">{problem.assignedTo}</td>
                    <td className="px-3 md:px-4 py-2">
                      <div className="flex gap-2">
                        <button className="p-1 text-[#FFCABE] hover:bg-[#FFF5F2] rounded transition-colors"><FaEye /></button>
                        <button onClick={() => handleAssign(problem.id)} className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"><FaCheckCircle /></button>
                        <button onClick={() => handleDelete(problem.id)} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProblems;