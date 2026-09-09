import React, { useEffect, useState } from 'react';
import {
  FaChartBar,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaUniversity,
  FaBuilding,
  FaSpinner
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {

    try {

      setLoading(true);

      const response = await api.get('/api/admin/stats');

      if (response.data?.success) {
        setStats(response.data.data);
      }

    } catch (error) {

      console.error('Analytics error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load analytics'
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {

    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

        <Sidebar role="admin" />

        <div className="flex-1 ml-64 flex items-center justify-center">

          <div className="text-center">

            <FaSpinner className="animate-spin text-4xl text-[#D4A09A] mx-auto mb-4" />

            <p className="text-gray-500">
              Loading analytics...
            </p>

          </div>

        </div>

      </div>
    );
  }

  const totalReports =
    stats?.problems?.total ??
    stats?.totalProblems ??
    0;

  const solved =
    stats?.problems?.solved ??
    stats?.solvedProblems ??
    0;

  const activeUsers =
    stats?.users?.active ??
    stats?.activeUsers ??
    0;

  const resolutionRate =
    totalReports > 0
      ? Math.round((solved / totalReports) * 100)
      : 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="admin" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Analytics Dashboard
          </h1>

          <p className="text-gray-400">
            Platform performance and citizen problem insights
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <StatCard
            title="Total Reports"
            value={totalReports}
            icon={<FaFileAlt />}
          />

          <StatCard
            title="Solved Problems"
            value={solved}
            icon={<FaCheckCircle />}
          />

          <StatCard
            title="Resolution Rate"
            value={`${resolutionRate}%`}
            icon={<FaCheckCircle />}
          />

          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={<FaUsers />}
          />

        </div>

        <div className="bg-white/80 rounded-2xl border border-gray-100 p-6">

          <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">

            <FaChartBar className="text-pink-400" />

            Problem Status Overview

          </h2>

          <div className="space-y-4">

            <StatusRow
              label="Pending"
              value={
                stats?.problems?.pending ??
                stats?.pendingProblems ??
                0
              }
            />

            <StatusRow
              label="Under Review"
              value={
                stats?.problems?.underReview ??
                0
              }
            />

            <StatusRow
              label="In Progress"
              value={
                stats?.problems?.inProgress ??
                0
              }
            />

            <StatusRow
              label="Solved"
              value={solved}
            />

          </div>

        </div>

      </div>

    </div>
  );
};

const StatCard = ({ title, value, icon }) => (

  <div className="bg-white/80 rounded-2xl border border-gray-100 p-4">

    <div className="flex justify-between items-center">

      <span className="text-sm text-gray-400">
        {title}
      </span>

      <span className="text-xl text-[#D4A09A]">
        {icon}
      </span>

    </div>

    <p className="text-2xl md:text-3xl font-bold text-gray-700 mt-2">
      {value}
    </p>

  </div>
);

const StatusRow = ({ label, value }) => (

  <div className="flex items-center justify-between">

    <span className="text-gray-600">
      {label}
    </span>

    <span className="font-bold text-gray-700">
      {value}
    </span>

  </div>
);

export default Analytics;