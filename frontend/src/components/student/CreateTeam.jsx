import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaSpinner } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CreateTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 6,
    skills: [],
    university: user?.university || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Team name is required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      
      const response = await fetch('http://localhost:5000/api/student/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          maxMembers: formData.maxMembers,
          university: formData.university || user?.university
        })
      });

      const data = await response.json();
      console.log('📥 Create team response:', data);

      if (data.success) {
        toast.success('✅ Team created successfully!');
        navigate('/student/teams');
      } else {
        toast.error(data.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('❌ Error creating team:', error);
      toast.error('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role={user?.role || 'student'} />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-[#D4A09A] transition-colors flex items-center gap-2 mb-4"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#FFCABE] rounded-xl flex items-center justify-center">
                <FaUsers className="text-[#8B5E5E] text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-700">Create New Team</h1>
                <p className="text-sm text-gray-400">Build your team for solving problems</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Team Name <span className="text-red-400">*</span>
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
            {[2, 3, 4, 5, 6].map(num => (
           <option key={num} value={num}>
             {num} members
         </option>
          ))}
          </select>
              </div>

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
                  {loading ? <FaSpinner className="animate-spin" /> : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;