import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCoins,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const FundProject = () => {
  // IMPORTANT:
  // Route is /industry/fund/:projectId
  const { projectId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    fundingType: 'Grant',
    description: '',
    timeline: '',
    transactionId: '',
    remarks: ''
  });

  // --------------------------------------------------
  // FETCH PROJECT
  // --------------------------------------------------
  useEffect(() => {
    if (!projectId) {
      console.error('❌ FUND PROJECT: projectId is missing');
      toast.error('Project ID is missing');
      setLoading(false);
      return;
    }

    console.log('🔥 FUND PROJECT URL ID:', projectId);
    console.log(
      '🔥 FUND PROJECT URL ID TYPE:',
      typeof projectId
    );

    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('jwt_token');

      if (!token) {
        throw new Error('Please login again');
      }

      const response = await fetch(
        `http://localhost:5000/api/industry/projects/${encodeURIComponent(projectId)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log('🔥 FUND PROJECT FETCH RESPONSE:', data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to load project'
        );
      }

      const projectData =
        data.data?.project ||
        data.data?.data ||
        data.data;

      if (!projectData) {
        throw new Error('Project data not found');
      }

      setProject(projectData);

    } catch (error) {
      console.error(
        '❌ FUND PROJECT FETCH ERROR:',
        error
      );

      toast.error(
        error.message || 'Failed to load project'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --------------------------------------------------
  // SUBMIT FUNDING
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectId) {
      toast.error('Project ID is missing');
      return;
    }

    if (!formData.amount) {
      toast.error('Please enter funding amount');
      return;
    }

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error(
        'Funding amount must be greater than 0'
      );
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        throw new Error('Please login again');
      }

      // IMPORTANT:
      // This EXACT projectId came from:
      // /industry/fund/:projectId
      //
      // Backend route:
      // POST /api/industry/funding
      //
      // projectId is sent in the request body.

      const requestBody = {
        projectId: projectId,
        amount: amount,
        fundingType: formData.fundingType,
        description: formData.description,
        timeline: formData.timeline,
        transactionId: formData.transactionId,
        remarks: formData.remarks
      };

      console.log(
        '🔥 FUNDING REQUEST BODY:',
        requestBody
      );

      const response = await fetch(
        'http://localhost:5000/api/industry/funding',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json();

      console.log(
        '🔥 FUNDING RESPONSE:',
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to fund project'
        );
      }

      toast.success(
        data.message || 'Project funded successfully!'
      );

      // Go back to the SAME project.
      navigate(
        `/industry/project/${encodeURIComponent(projectId)}`
      );

    } catch (error) {
      console.error(
        '❌ FUNDING SUBMIT ERROR:',
        error
      );

      toast.error(
        error.message || 'Failed to fund project'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FFF5F2] pt-16">

        <Sidebar role="industry" />

        <div className="flex-1 ml-64 flex items-center justify-center">

          <FaSpinner className="animate-spin text-4xl text-[#FFCABE]" />

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // PROJECT NOT FOUND
  // --------------------------------------------------
  if (!project) {
    return (
      <div className="flex min-h-screen bg-[#FFF5F2] pt-16">

        <Sidebar role="industry" />

        <div className="flex-1 ml-64 p-8">

          <Link
            to="/industry/projects"
            className="text-[#D4A09A] flex items-center mb-5 text-sm"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </Link>

          <div className="bg-white rounded-2xl p-6">

            <p className="text-gray-500">
              Project not found.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------
  return (
    <div className="flex min-h-screen bg-[#FFF5F2] pt-16">

      <Sidebar role="industry" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <Link
            to={`/industry/project/${encodeURIComponent(projectId)}`}
            className="text-[#D4A09A] flex items-center mb-5 text-sm"
          >
            <FaArrowLeft className="mr-2" />
            Back to Project
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl p-6 border border-[#FFCABE] mb-5">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <FaCoins className="text-green-600 text-xl" />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-700">
                  Fund Project
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                  {project.title}
                </p>

              </div>

            </div>

          </div>

          {/* Existing funding */}
          {Number(project.fundingAmount || 0) > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5">

              <div className="flex items-center gap-3">

                <FaCheckCircle className="text-green-600 text-xl" />

                <div>

                  <p className="font-semibold text-green-700">
                    This project has already received funding
                  </p>

                  <p className="text-green-600 text-sm mt-1">
                    Current funding: ₹
                    {Number(
                      project.fundingAmount
                    ).toLocaleString('en-IN')}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Funding Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >

            <div className="space-y-5">

              {/* Amount */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Funding Amount *
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    placeholder="Enter amount"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-[#FFCABE]"
                    required
                  />

                </div>

              </div>

              {/* Funding Type */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Funding Type
                </label>

                <select
                  name="fundingType"
                  value={formData.fundingType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FFCABE]"
                >

                  <option value="Grant">
                    Grant
                  </option>

                  <option value="Investment">
                    Investment
                  </option>

                  <option value="Sponsorship">
                    Sponsorship
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* Description */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Funding Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Explain the purpose of this funding..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FFCABE] resize-none"
                />

              </div>

              {/* Timeline */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Funding Timeline
                </label>

                <input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="Example: 6 months"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FFCABE]"
                />

              </div>

              {/* Transaction ID */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction / Reference ID
                </label>

                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder="Optional reference ID"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FFCABE]"
                />

              </div>

              {/* Remarks */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Additional remarks..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FFCABE] resize-none"
                />

              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >

                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCoins />
                      Confirm Funding
                    </>
                  )}

                </button>

                <Link
                  to={`/industry/project/${encodeURIComponent(projectId)}`}
                  className="flex-1 border border-gray-200 text-gray-600 px-5 py-3 rounded-xl font-semibold flex items-center justify-center"
                >
                  Cancel
                </Link>

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default FundProject;