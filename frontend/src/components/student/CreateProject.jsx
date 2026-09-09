import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FaProjectDiagram,
  FaSpinner,
  FaArrowLeft,
  FaLaptopCode,
  FaMicrochip,
  FaUpload,
  FaFile
} from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreateProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const problemId = searchParams.get('problemId');
  const teamId = searchParams.get('teamId');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    solutionType: 'Software'
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSolutionTypeChange = (type) => {
    setFormData({
      ...formData,
      solutionType: type
    });

    setSelectedFiles([]);
    setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const maxFileSize = 50 * 1024 * 1024; // 50 MB per file

    if (files.length > 10) {
      setError('You can upload a maximum of 10 files.');
      e.target.value = '';
      return;
    }

    for (const file of files) {
      if (file.size > maxFileSize) {
        setError(`"${file.name}" is larger than 50 MB.`);
        e.target.value = '';
        return;
      }
    }

    // Hardware projects → images only
    if (formData.solutionType === 'Hardware') {
      const invalidFile = files.find(
        (file) => !file.type.startsWith('image/')
      );

      if (invalidFile) {
        setError(
          'Hardware projects can only upload product pictures.'
        );
        e.target.value = '';
        return;
      }
    }

    // Software projects → supported files
    if (formData.solutionType === 'Software') {
      const allowedExtensions = [
        '.zip',
        '.pdf',
        '.ppt',
        '.pptx',
        '.doc',
        '.docx',
        '.png',
        '.jpg',
        '.jpeg'
      ];

      const invalidFile = files.find((file) => {
        const extension =
          '.' + file.name.split('.').pop().toLowerCase();

        return !allowedExtensions.includes(extension);
      });

      if (invalidFile) {
        setError(
          `"${invalidFile.name}" is not a supported software project file.`
        );
        e.target.value = '';
        return;
      }
    }

    setError('');
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please enter a project title.');
      return;
    }

    if (formData.title.trim().length < 5) {
      setError('Project title must be at least 5 characters.');
      return;
    }

    if (formData.description.trim().length < 10) {
      setError(
        'Project description must be at least 10 characters.'
      );
      return;
    }

    if (!teamId) {
      setError(
        'Team information is missing. Please create or join a team first.'
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('jwt_token');

      if (!token) {
        setError('Please login again.');
        return;
      }

      // ============================================
      // CREATE FORMDATA
      // ============================================

      const requestBody = new FormData();

      requestBody.append(
        'title',
        formData.title.trim()
      );

      requestBody.append(
        'description',
        formData.description.trim()
      );

      requestBody.append(
        'problemId',
        problemId || ''
      );

      requestBody.append(
        'teamId',
        teamId
      );

      requestBody.append(
        'solutionType',
        formData.solutionType
      );

      // Add actual files
      selectedFiles.forEach((file) => {
        requestBody.append('files', file);
      });

      console.log(
        '📤 Creating project with files:',
        selectedFiles.length
      );

      // ============================================
      // SEND TO BACKEND
      // ============================================

      const response = await fetch(
        `${API_URL}/api/student/projects`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: requestBody
        }
      );

      const data = await response.json();

      console.log('📥 Create project response:', data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to create project'
        );
      }

      alert(
        selectedFiles.length > 0
          ? 'Project created and files uploaded successfully! 🎉'
          : 'Project created successfully! 🎉'
      );

      navigate('/student/my-projects');

    } catch (err) {
      console.error(
        '❌ Create project error:',
        err
      );

      setError(
        err.message ||
        'Failed to create project'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="student" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-3xl mx-auto">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">

              <div className="p-3 bg-pink-50 rounded-xl">
                <FaProjectDiagram className="text-[#FFCABE] text-2xl" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-700">
                  Create Project
                </h1>

                <p className="text-sm text-gray-400">
                  Create a project with your team to solve the selected problem.
                </p>
              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Project Title */}
              <div>

                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Project Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your project title"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFCABE]"
                  required
                />

              </div>

              {/* Project Description */}
              <div>

                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Project Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project and how it will solve the problem..."
                  rows="6"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFCABE] resize-none"
                  required
                />

              </div>

              {/* Solution Type */}
              <div>

                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Solution Type
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Software */}
                  <button
                    type="button"
                    onClick={() =>
                      handleSolutionTypeChange('Software')
                    }
                    className={`p-5 rounded-xl border-2 text-left transition ${
                      formData.solutionType === 'Software'
                        ? 'border-[#E8B5A9] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className="p-3 rounded-lg bg-blue-50">
                        <FaLaptopCode className="text-blue-500 text-xl" />
                      </div>

                      <div>

                        <h3 className="font-semibold text-gray-700">
                          Software Solution
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                          Upload source code, documentation, PPT, etc.
                        </p>

                      </div>

                    </div>

                  </button>

                  {/* Hardware */}
                  <button
                    type="button"
                    onClick={() =>
                      handleSolutionTypeChange('Hardware')
                    }
                    className={`p-5 rounded-xl border-2 text-left transition ${
                      formData.solutionType === 'Hardware'
                        ? 'border-[#E8B5A9] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className="p-3 rounded-lg bg-purple-50">
                        <FaMicrochip className="text-purple-500 text-xl" />
                      </div>

                      <div>

                        <h3 className="font-semibold text-gray-700">
                          Hardware Solution
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                          Upload pictures of your physical product/prototype.
                        </p>

                      </div>

                    </div>

                  </button>

                </div>

              </div>

              {/* File Upload */}
              <div>

                <label className="block text-sm font-medium text-gray-600 mb-2">

                  {formData.solutionType === 'Software'
                    ? 'Upload Project Files'
                    : 'Upload Product Pictures'}

                </label>

                <label className="flex flex-col items-center justify-center w-full min-h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">

                  <FaUpload className="text-2xl text-gray-400 mb-3" />

                  <p className="text-sm font-medium text-gray-600">
                    Click to select files
                  </p>

                  {formData.solutionType === 'Software' ? (

                    <p className="text-xs text-gray-400 mt-2 text-center px-4">
                      ZIP, PDF, PPT, PPTX, DOC, DOCX, PNG, JPG, JPEG
                    </p>

                  ) : (

                    <p className="text-xs text-gray-400 mt-2">
                      JPG, JPEG, PNG and other image formats
                    </p>

                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    Maximum 50 MB per file
                  </p>

                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept={
                      formData.solutionType === 'Hardware'
                        ? 'image/*'
                        : '.zip,.pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg'
                    }
                    className="hidden"
                  />

                </label>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (

                  <div className="mt-3 space-y-2">

                    <p className="text-sm font-medium text-gray-600">
                      Selected Files ({selectedFiles.length})
                    </p>

                    {selectedFiles.map(
                      (file, index) => (

                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                        >

                          <FaFile className="text-gray-400" />

                          <div className="flex-1 min-w-0">

                            <p className="text-sm text-gray-700 truncate">
                              {file.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {(
                                file.size /
                                (1024 * 1024)
                              ).toFixed(2)} MB
                            </p>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

              {/* Problem Information */}
              {problemId && (

                <div className="p-3 rounded-xl bg-blue-50 text-sm text-blue-600">
                  This project will be linked to the selected problem.
                </div>

              )}

              {/* Team Information */}
              {teamId && (

                <div className="p-3 rounded-xl bg-purple-50 text-sm text-purple-600">
                  This project will be created for your selected team.
                </div>

              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white font-semibold hover:shadow-lg transition disabled:opacity-60"
              >

                {loading ? (

                  <>
                    <FaSpinner className="animate-spin" />
                    Uploading & Creating Project...
                  </>

                ) : (

                  <>
                    <FaProjectDiagram />
                    Create Project
                  </>

                )}

              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateProject;