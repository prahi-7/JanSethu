import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaUserPlus, 
  FaComments,
  FaUniversity,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaPlus,
  FaTimes
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const UniversityTeams = () => {
  const [teams, setTeams] = useState([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '', maxMembers: 5 });

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeam.name) {
      toast.error('Please enter team name');
      return;
    }
    toast.success('Team created successfully! 🎉');
    setShowCreateTeam(false);
    setNewTeam({ name: '', description: '', maxMembers: 5 });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">University Teams</h1>
            <p className="text-sm md:text-base text-gray-400">Form teams with students from your university</p>
          </div>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm md:text-base shadow-[#FFCABE]"
          >
            <FaPlus /> Create Team
          </button>
        </div>

        {teams.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaUsers className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No teams available</p>
            <p className="text-sm text-gray-400 mt-1">Create a team to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all">
                {/* Team details */}
              </div>
            ))}
          </div>
        )}

        {showCreateTeam && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Create New Team</h2>
                <button onClick={() => setShowCreateTeam(false)} className="text-gray-400 hover:text-gray-600">
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
                      className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={newTeam.description}
                      onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                      placeholder="What kind of problems are you interested in?"
                      rows="2"
                      className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Max Members</label>
                    <select
                      value={newTeam.maxMembers}
                      onChange={(e) => setNewTeam({ ...newTeam, maxMembers: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
                    >
                      {[3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} members</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setShowCreateTeam(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all text-sm">
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

export default UniversityTeams;