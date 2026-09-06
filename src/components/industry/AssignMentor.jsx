import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaUserTie, 
  FaUsers,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaArrowRight,
  FaPlus,
  FaTimes,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaHeart,
  FaTrash,
  FaEdit
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const AssignMentor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedMentor, setSelectedMentor] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [mentors, setMentors] = useState([
    { id: 1, name: 'Dr. Suresh Reddy', expertise: 'Environmental Engineering', email: 'suresh@email.com', phone: '+91 98765 43210' },
    { id: 2, name: 'Prof. Meena Gupta', expertise: 'Waste Management', email: 'meena@email.com', phone: '+91 98765 43211' },
    { id: 3, name: 'Dr. Rajesh Singh', expertise: 'IoT & Sensors', email: 'rajesh@email.com', phone: '+91 98765 43212' },
    { id: 4, name: 'Prof. Amit Kumar', expertise: 'AI/ML', email: 'amit@email.com', phone: '+91 98765 43213' },
  ]);

  const [newMentor, setNewMentor] = useState({
    name: '',
    expertise: '',
    email: '',
    phone: '',
  });

  const handleAssignMentor = (e) => {
    e.preventDefault();
    if (!selectedMentor) {
      toast.error('Please select a mentor');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Mentor assigned successfully! 🎉');
      setLoading(false);
      navigate('/industry/dashboard');
    }, 1500);
  };

  const handleAddMentor = (e) => {
    e.preventDefault();
    const { name, expertise, email, phone } = newMentor;
    if (!name || !expertise || !email || !phone) {
      toast.error('Please fill all fields');
      return;
    }
    const mentor = { 
      id: Date.now(), 
      name, 
      expertise, 
      email, 
      phone 
    };
    setMentors([...mentors, mentor]);
    setNewMentor({ name: '', expertise: '', email: '', phone: '' });
    setShowAddMentor(false);
    toast.success('Mentor added successfully! 🎉');
  };

  // ✅ Delete Mentor Function
  const handleDeleteMentor = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    setMentors(mentors.filter(m => m.id !== showDeleteConfirm));
    setShowDeleteConfirm(null);
    toast.success('Mentor deleted successfully! 🗑️');
  };

  const handleChange = (e) => {
    setNewMentor({ ...newMentor, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5F2] pt-16">
      <Sidebar role="industry" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <Link to="/industry/dashboard" className="text-[#D4A09A] hover:text-[#8B5E5E] flex items-center mb-4 text-sm group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Assign Mentor</h1>
            <button
              onClick={() => setShowAddMentor(true)}
              className="bg-[#FFCABE] text-[#8B5E5E] px-4 py-2 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE]/30 transition-all flex items-center gap-2 text-sm"
            >
              <FaPlus /> Add Mentor
            </button>
          </div>
          <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Assign a mentor to guide the student team on this project</p>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#FFCABE] p-4 md:p-6">
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-[#FFF5F2] rounded-xl border border-[#FFCABE]">
              <h3 className="font-semibold text-[#D4A09A] text-sm md:text-base">Project: Water Quality Monitoring System</h3>
              <p className="text-xs md:text-sm text-gray-500">Team: Environmental Engineering Team • 4 members</p>
            </div>

            <form onSubmit={handleAssignMentor}>
              <div className="space-y-3 md:space-y-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Select Mentor</label>
                {mentors.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <p className="text-sm">No mentors available. Please add a mentor.</p>
                  </div>
                ) : (
                  mentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className={`flex items-start gap-3 md:gap-4 p-3 md:p-4 border rounded-xl transition-all ${
                        selectedMentor === mentor.id 
                          ? 'border-[#FFCABE] bg-[#FFF5F2] shadow-sm shadow-[#FFCABE]/20' 
                          : 'border-gray-200 hover:border-[#FFCABE] hover:bg-[#FFF5F2]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mentor"
                        value={mentor.id}
                        checked={selectedMentor === mentor.id}
                        onChange={(e) => setSelectedMentor(parseInt(e.target.value))}
                        className="mt-1 w-4 h-4 text-[#FFCABE] border-gray-300 focus:ring-[#FFCABE]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FaUserTie className="text-[#D4A09A]" />
                          <span className="font-semibold text-gray-700 text-sm md:text-base">{mentor.name}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">Expertise: {mentor.expertise}</p>
                        <div className="flex flex-wrap gap-3 md:gap-4 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><FaEnvelope /> {mentor.email}</span>
                          <span className="flex items-center gap-1"><FaPhone /> {mentor.phone}</span>
                        </div>
                      </div>
                      {/* ✅ Delete Mentor Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteMentor(mentor.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Mentor"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                type="submit"
                disabled={loading || mentors.length === 0}
                className="w-full mt-4 md:mt-6 bg-[#FFCABE] text-[#8B5E5E] py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE]/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:scale-[1.02] text-sm md:text-base"
              >
                <FaUserTie />
                {loading ? 'Assigning...' : 'Assign Mentor'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#FFCABE]">
            <div className="text-center">
              <FaTrash className="text-4xl text-red-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-700 mb-2">Delete Mentor?</h2>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this mentor? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition-all text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Mentor Modal */}
      {showAddMentor && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#FFCABE]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <FaUserTie className="text-[#D4A09A]" /> Add New Mentor
              </h2>
              <button onClick={() => setShowAddMentor(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddMentor}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter mentor name"
                      value={newMentor.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Expertise *</label>
                  <div className="relative">
                    <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="expertise"
                      placeholder="e.g., Environmental Engineering"
                      value={newMentor.expertise}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="mentor@email.com"
                      value={newMentor.email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone *</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={newMentor.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFCABE] text-gray-700 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowAddMentor(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#FFCABE] text-[#8B5E5E] py-2 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE]/30 transition-all flex items-center justify-center gap-2 text-sm">
                  <FaPlus /> Add Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignMentor;