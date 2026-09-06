import React, { useState } from 'react';
import { FaSave, FaUser, FaLock, FaEnvelope, FaArrowLeft, FaBell, FaShieldAlt } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@jansethu.in',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Settings updated successfully! 🎉');
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">Admin Settings</h1>
          <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Manage your account settings and preferences</p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="border-b border-gray-100 pb-4 md:pb-6">
                <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                  <FaUser className="text-pink-400" /> Profile Information
                </h2>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-4 md:pb-6">
                <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                  <FaLock className="text-yellow-400" /> Change Password
                </h2>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-4 md:pb-6">
                <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                  <FaBell className="text-blue-400" /> Notifications
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFCABE]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Push Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFCABE]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <FaSave /> Save Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;