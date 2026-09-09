import React, { useEffect, useState } from 'react';
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
import api from '../../services/api';

const CpgramsIntegration = () => {
  const [pendingEscalations, setPendingEscalations] = useState([]);
  const [escalatedProblems, setEscalatedProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [remarks, setRemarks] = useState('');

  // --------------------------------------------------
  // LOAD CPGRAMS DATA
  // --------------------------------------------------
  const loadCPGRAMSData = async () => {
    try {
      setPageLoading(true);

      const [pendingResponse, escalatedResponse] = await Promise.all([
        api.get('/api/admin/escalations/pending'),
        api.get('/api/admin/escalations')
      ]);

      const pendingData = pendingResponse?.data?.data;
      const escalatedData = escalatedResponse?.data?.data;

      setPendingEscalations(
        Array.isArray(pendingData) ? pendingData : []
      );

      setEscalatedProblems(
        Array.isArray(escalatedData) ? escalatedData : []
      );
    } catch (error) {
      console.error('Error loading CPGRAMS data:', error);

      toast.error(
        error?.response?.data?.message ||
        'Failed to load CPGRAMS data'
      );
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadCPGRAMSData();
  }, []);

  // --------------------------------------------------
  // ESCALATE PROBLEM
  // --------------------------------------------------
  const handleEscalateToCPGRAMS = (problem) => {
    setSelectedProblem(problem);
    setRemarks('');
    setShowEscalateModal(true);
  };

  const confirmEscalation = async () => {
    if (!selectedProblem) return;

    try {
      setLoading(true);

      const problemId =
        selectedProblem._id ||
        selectedProblem.id ||
        selectedProblem.problemId;

      await api.post('/api/admin/escalations', {
        problemId,
        remarks
      });

      toast.success('✅ Problem escalated to CPGRAMS successfully!');

      setShowEscalateModal(false);
      setSelectedProblem(null);
      setRemarks('');

      await loadCPGRAMSData();
    } catch (error) {
      console.error('Escalation error:', error);

      toast.error(
        error?.response?.data?.message ||
        'Failed to escalate problem'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SYNC
  // --------------------------------------------------
  const handleSyncWithCPGRAMS = async () => {
    const toastId = toast.loading('Syncing with CPGRAMS...');

    try {
      await loadCPGRAMSData();

      toast.success(
        '✅ Synced with CPGRAMS successfully!',
        { id: toastId }
      );
    } catch (error) {
      toast.error(
        'Failed to sync with CPGRAMS',
        { id: toastId }
      );
    }
  };

  // --------------------------------------------------
  // UPDATE ESCALATION STATUS
  // --------------------------------------------------
  const handleStatusChange = async (escalationId, status) => {
    try {
      await api.put(
        `/api/admin/escalations/${escalationId}/status`,
        {
          status
        }
      );

      toast.success('✅ Escalation status updated');

      await loadCPGRAMSData();
    } catch (error) {
      console.error('Status update error:', error);

      toast.error(
        error?.response?.data?.message ||
        'Failed to update escalation status'
      );
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (pageLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="admin" />

        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <FaSync className="text-3xl text-[#D4A09A] animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              Loading CPGRAMS data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="admin" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
              CPGRAMS Integration
            </h1>

            <p className="text-sm md:text-base text-gray-400">
              Manage problems pending escalation to CPGRAMS portal
            </p>
          </div>

          <button
            onClick={handleSyncWithCPGRAMS}
            className="bg-[#FFF5F2] text-[#D4A09A] border border-[#FFCABE] px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-pink-100 transition-all flex items-center gap-2 text-sm"
          >
            <FaSync /> Sync
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">
              Pending Escalation
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">
              {pendingEscalations.length}
            </p>

            <p className="text-[10px] md:text-xs text-gray-400">
              Problems pending &gt; 7 days
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">
              Escalated to CPGRAMS
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500">
              {escalatedProblems.length}
            </p>

            <p className="text-[10px] md:text-xs text-gray-400">
              Successfully escalated
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <p className="text-[10px] md:text-sm text-gray-400">
              Total Escalations
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#FFCABE]">
              {pendingEscalations.length + escalatedProblems.length}
            </p>

            <p className="text-[10px] md:text-xs text-gray-400">
              Last 30 days
            </p>
          </div>

        </div>

        {/* EMPTY STATE */}
        {pendingEscalations.length === 0 &&
        escalatedProblems.length === 0 ? (

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">

            <FaCheckCircle className="text-4xl md:text-5xl text-gray-300 mx-auto mb-3 md:mb-4" />

            <p className="text-base md:text-lg text-gray-500">
              No escalations pending
            </p>

            <p className="text-sm text-gray-400 mt-1">
              All problems are within the 7-day timeline
            </p>

          </div>

        ) : (

          <>
            {/* PENDING ESCALATIONS */}
            {pendingEscalations.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-4 md:mb-6">

                <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-500" />
                  Pending Escalation ({pendingEscalations.length})
                </h2>

                {pendingEscalations.map((problem) => (

                  <div
                    key={
                      problem._id ||
                      problem.id ||
                      problem.problemId
                    }
                    className="bg-yellow-50/50 rounded-xl p-3 md:p-4 border border-yellow-200 mb-3 last:mb-0"
                  >

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2 mb-1">

                          <p className="text-sm font-semibold text-gray-700">
                            {problem.problemId ||
                              problem._id ||
                              problem.id}
                          </p>

                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <FaClock />
                            {problem.pendingDays || 7} days
                          </span>

                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                          {problem.title ||
                            problem.problem?.title ||
                            'Untitled Problem'}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {problem.description ||
                            problem.problem?.description ||
                            'No description available'}
                        </p>

                        {(problem.location?.address ||
                          problem.problem?.location?.address) && (
                          <p className="text-xs text-gray-400 mt-1">
                            📍{' '}
                            {problem.location?.address ||
                              problem.problem?.location?.address}
                          </p>
                        )}

                      </div>

                      <button
                        onClick={() =>
                          handleEscalateToCPGRAMS(problem)
                        }
                        className="bg-gradient-to-r from-red-500 to-[#E8B5A9] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <FaExternalLinkAlt />
                        Escalate
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

            {/* ESCALATED */}
            {escalatedProblems.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">

                <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Escalated to CPGRAMS ({escalatedProblems.length})
                </h2>

                {escalatedProblems.map((problem) => (

                  <div
                    key={problem._id || problem.id}
                    className="bg-green-50/50 rounded-xl p-3 md:p-4 border border-green-200 mb-3 last:mb-0"
                  >

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

                      <div className="flex-1">

                        <p className="text-sm font-semibold text-gray-700">
                          {problem.problemId ||
                            problem.problem?.title ||
                            'Problem'}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {problem.problem?.description ||
                            problem.description ||
                            'No description available'}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">

                          <span className="text-xs bg-white border border-green-200 text-green-700 px-2 py-1 rounded-lg">
                            CPGRAMS Ref:{' '}
                            {problem.cpgramsReference ||
                              'N/A'}
                          </span>

                          <span className="text-xs bg-white border border-green-200 text-green-700 px-2 py-1 rounded-lg">
                            {problem.status || 'Processing'}
                          </span>

                        </div>

                      </div>

                      <select
                        value={problem.status || 'Processing'}
                        onChange={(e) =>
                          handleStatusChange(
                            problem._id,
                            e.target.value
                          )
                        }
                        className="border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>

                    </div>

                  </div>

                ))}

              </div>
            )}
          </>
        )}
      </div>

      {/* ESCALATION MODAL */}
      {showEscalateModal && selectedProblem && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">

            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Escalate to CPGRAMS
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to escalate this problem to CPGRAMS?
            </p>

            <div className="bg-[#FFF5F2]/50 rounded-xl p-4 mb-4 border border-pink-100">

              <p className="text-sm text-gray-500">
                Problem ID:{' '}
                {selectedProblem?.problemId ||
                  selectedProblem?._id ||
                  selectedProblem?.id}
              </p>

              <p className="text-sm text-gray-700 font-semibold">
                {selectedProblem?.title ||
                  selectedProblem?.problem?.title}
              </p>

              <p className="text-sm text-gray-400">
                Pending for{' '}
                {selectedProblem?.pendingDays || 7} days
              </p>

            </div>

            {/* REMARKS */}
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks (optional)"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-600 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-pink-100"
              rows="3"
            />

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setShowEscalateModal(false);
                  setSelectedProblem(null);
                  setRemarks('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>

              <button
                onClick={confirmEscalation}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-[#E8B5A9] text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
              >
                {loading
                  ? 'Escalating...'
                  : 'Confirm Escalation'}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default CpgramsIntegration;