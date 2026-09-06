import React, { useState } from 'react';
import { 
  FaExternalLinkAlt, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSync,
  FaDownload,
  FaArrowLeft,
  FaFileAlt
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const CpgramsIntegration = () => {
  const [pendingEscalations, setPendingEscalations] = useState([]);
  const [escalatedProblems, setEscalatedProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  const handleEscalateToCPGRAMS = (problem) => {
    setSelectedProblem(problem);
    setShowEscalateModal(true);
  };

  const confirmEscalation = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('✅ Problem escalated to CPGRAMS successfully!');
      setShowEscalateModal(false);
      setLoading(false);
    }, 1500);
  };

  const handleSyncWithCPGRAMS = () => {
    toast.loading('Syncing with CPGRAMS...', { duration: 2000 });
    setTimeout(() => {
      toast.success('✅ Synced with CPGRAMS successfully!');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">CPGRAMS Integration</h1>
            <p className="text-sm md:text-base text-gray-400">Manage problems pending escalation to CPGRAMS portal</p>
          </div>
          <button
            onClick={handleSyncWithCPGRAMS}
            className="bg-[#FFF5F2] text-[#D4A09A] border border-[#FFCABE] px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-pink-100 transition-all flex items-center gap-2 text-sm"
          >
            <FaSync /> Sync
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">Pending Escalation</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">{pendingEscalations.length}</p>
            <p className="text-[10px] md:text-xs text-gray-400">Problems pending &gt; 7 days</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">Escalated to CPGRAMS</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">{escalatedProblems.length}</p>
            <p className="text-[10px] md:text-xs text-gray-400">Successfully escalated</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">Total Escalations</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#FFCABE]">{pendingEscalations.length + escalatedProblems.length}</p>
            <p className="text-[10px] md:text-xs text-gray-400">Last 30 days</p>
          </div>
        </div>

        {pendingEscalations.length === 0 && escalatedProblems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <FaCheckCircle className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-gray-500">No escalations pending</p>
            <p className="text-sm text-gray-400 mt-1">All problems are within the 7-day timeline</p>
          </div>
        ) : (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-500" /> Pending Escalation ({pendingEscalations.length})
              </h2>
              {pendingEscalations.map((problem) => (
                <div key={problem.id} className="bg-yellow-50/50 rounded-xl p-3 md:p-4 border border-yellow-200 mb-3 last:mb-0">
                  {/* Problem details */}
                </div>
              ))}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Escalated to CPGRAMS ({escalatedProblems.length})
              </h2>
              {escalatedProblems.map((problem) => (
                <div key={problem.id} className="bg-green-50/50 rounded-xl p-3 md:p-4 border border-green-200 mb-3 last:mb-0">
                  {/* Problem details */}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showEscalateModal && selectedProblem && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Escalate to CPGRAMS</h2>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to escalate this problem to CPGRAMS?</p>
            <div className="bg-[#FFF5F2]/50 rounded-xl p-4 mb-4 border border-pink-100">
              <p className="text-sm text-gray-500">Problem ID: {selectedProblem?.problemId}</p>
              <p className="text-sm text-gray-700 font-semibold">{selectedProblem?.title}</p>
              <p className="text-sm text-gray-400">Pending for {selectedProblem?.pendingDays} days</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmEscalation}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-[#E8B5A9] text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? 'Escalating...' : 'Confirm Escalation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CpgramsIntegration;