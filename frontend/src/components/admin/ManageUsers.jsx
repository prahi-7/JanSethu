import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaFilter, FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      toast.success('User deleted successfully');
    }
  };

  const getRoleBadge = (role) => {
    const map = {
      'citizen': 'bg-blue-50 text-blue-600 border-blue-200',
      'student': 'bg-green-50 text-green-600 border-green-200',
      'mentor': 'bg-purple-50 text-purple-600 border-purple-200',
      'industry': 'bg-orange-50 text-orange-600 border-orange-200',
      'admin': 'bg-red-50 text-red-600 border-red-200',
      'government': 'bg-[#FFF5F2] text-[#D4A09A] border-[#FFCABE]',
      'university': 'bg-indigo-50 text-indigo-600 border-indigo-200',
    };
    return map[role] || map['citizen'];
  };

  if (users.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="admin" />
        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Manage Users</h1>
              <p className="text-sm md:text-base text-gray-400">View and manage all users on the platform</p>
            </div>
            <button className="bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm shadow-[#FFCABE]">
              <FaUserPlus /> Add User
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
                >
                  <option value="all">All Roles</option>
                  <option value="citizen">Citizen</option>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="industry">Industry</option>
                  <option value="admin">Admin</option>
                  <option value="government">Government</option>
                  <option value="university">University</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaUser className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No users registered yet</p>
            <p className="text-sm text-gray-400 mt-1">Users will appear here once they register</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Manage Users</h1>
            <p className="text-sm md:text-base text-gray-400">View and manage all users on the platform</p>
          </div>
          <button className="bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm shadow-[#FFCABE]">
            <FaUserPlus /> Add User
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 md:px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
              >
                <option value="all">All Roles</option>
                <option value="citizen">Citizen</option>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="industry">Industry</option>
                <option value="admin">Admin</option>
                <option value="government">Government</option>
                <option value="university">University</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FFF5F2]/50">
                <tr>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FFF5F2]/30 transition-colors">
                    <td className="px-3 md:px-4 py-2">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-500">{user.email}</td>
                    <td className="px-3 md:px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border ${
                        user.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-500">{user.joined}</td>
                    <td className="px-3 md:px-4 py-2">
                      <div className="flex gap-2">
                        <button className="p-1 text-[#FFCABE] hover:bg-[#FFF5F2] rounded transition-colors"><FaEdit /></button>
                        <button onClick={() => handleDelete(user.id)} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"><FaTrash /></button>
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

export default ManageUsers;