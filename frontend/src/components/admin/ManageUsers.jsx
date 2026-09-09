import React, { useEffect, useState } from 'react';
import {
  FaSearch,
  FaTrash,
  FaFilter,
  FaUser,
  FaSpinner
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filterRole !== 'all') {
        params.append('role', filterRole);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await api.get(
        `/api/admin/users?${params.toString()}`
      );

      console.log('Admin users response:', response.data);

      if (response.data?.success) {
        const result = response.data.data;

        /*
          Backend response structure:

          response.data
            └── data
                 ├── data       ← users array
                 └── pagination
        */

        const usersList =
          result?.data ||
          result?.users ||
          result?.results ||
          [];

        setUsers(Array.isArray(usersList) ? usersList : []);
      } else {
        setUsers([]);
        toast.error(
          response.data?.message || 'Failed to load users'
        );
      }

    } catch (error) {
      console.error('Fetch users error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load users'
      );

      setUsers([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [filterRole, searchTerm]);

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid user ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/api/admin/users/${id}`);

      toast.success('User deleted successfully');

      fetchUsers();

    } catch (error) {
      console.error('Delete user error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to delete user'
      );
    }
  };

  const getRoleBadge = (role) => {
    const map = {
      citizen: 'bg-blue-50 text-blue-600 border-blue-200',
      student: 'bg-green-50 text-green-600 border-green-200',
      mentor: 'bg-purple-50 text-purple-600 border-purple-200',
      industry: 'bg-orange-50 text-orange-600 border-orange-200',
      industry_partner: 'bg-orange-50 text-orange-600 border-orange-200',
      admin: 'bg-red-50 text-red-600 border-red-200',
      government: 'bg-pink-50 text-pink-600 border-pink-200',
      university: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      university_admin: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    };

    return map[role] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const formatRole = (role) => {
    if (!role) return '-';

    return role
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="admin" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Manage Users
          </h1>

          <p className="text-gray-400">
            View and manage all registered users
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 rounded-2xl border border-gray-100 p-4 mb-6">

          <div className="flex flex-col md:flex-row gap-3">

            {/* Search */}
            <div className="flex-1 relative">

              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">

              <FaFilter className="text-gray-400" />

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="all">All Roles</option>
                <option value="citizen">Citizen</option>
                <option value="student">Student</option>
                <option value="university">University</option>
                <option value="industry">Industry</option>
                <option value="government">Government</option>
                <option value="admin">Admin</option>
              </select>

            </div>

          </div>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="bg-white rounded-2xl p-12 text-center">

            <FaSpinner className="animate-spin text-4xl text-[#D4A09A] mx-auto mb-4" />

            <p className="text-gray-500">
              Loading users...
            </p>

          </div>

        ) : users.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center">

            <FaUser className="text-5xl text-gray-300 mx-auto mb-4" />

            <p className="text-lg text-gray-500">
              No users found
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Try changing the search or role filter.
            </p>

          </div>

        ) : (

          /* Users Table */
          <div className="bg-white/80 rounded-2xl border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-[#FFF5F2]">

                  <tr>

                    <th className="px-4 py-3 text-left text-xs text-gray-500">
                      User
                    </th>

                    <th className="px-4 py-3 text-left text-xs text-gray-500">
                      Email
                    </th>

                    <th className="px-4 py-3 text-left text-xs text-gray-500">
                      Role
                    </th>

                    <th className="px-4 py-3 text-left text-xs text-gray-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs text-gray-500">
                      Joined
                    </th>

                    <th className="px-4 py-3 text-left text-xs text-gray-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {users.map((user) => (

                    <tr
                      key={user._id || user.id}
                      className="hover:bg-[#FFF5F2]/40"
                    >

                      {/* User */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-full bg-[#FFCABE] flex items-center justify-center text-white font-bold">

                            {(user.name || 'U')
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <span className="font-medium text-gray-700">
                            {user.name || 'Unnamed User'}
                          </span>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {user.email || '-'}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {formatRole(user.role)}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.isActive === false
                              ? 'bg-red-50 text-red-600'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {user.isActive === false
                            ? 'Inactive'
                            : 'Active'}
                        </span>

                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">

                        <button
                          onClick={() =>
                            handleDelete(user._id || user.id)
                          }
                          title="Delete user"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <FaTrash />
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

    </div>
  );
};

export default ManageUsers;