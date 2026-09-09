import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaUser, FaCalendar, FaMapMarkerAlt, 
  FaTag, FaClock, FaCheck, FaTimes, FaExclamationTriangle,
  FaImage, FaVideo, FaFile, FaEye, FaSpinner,
  FaDownload, FaExternalLinkAlt
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProblemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProblemDetails();
    }
  }, [id]);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      // Fetch problem details
      const response = await fetch(`http://localhost:5000/api/problems/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('📥 Problem details:', data);
      
      if (data.success) {
        const problemData = data.data.problem || data.data;
        setProblem(problemData);
        
        // Fetch timeline if available
        try {
          const timelineRes = await fetch(`http://localhost:5000/api/problems/${id}/timeline`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const timelineData = await timelineRes.json();
          if (timelineData.success) {
            setTimeline(timelineData.data.timeline || []);
          }
        } catch (timelineError) {
          console.log('Timeline not available:', timelineError);
          setTimeline([]);
        }
      } else {
        setError(data.message || 'Failed to load problem');
        toast.error(data.message || 'Failed to load problem');
      }
    } catch (error) {
      console.error('❌ Error fetching problem:', error);
      setError('Failed to load problem details');
      toast.error('Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200';
    switch(status) {
      case 'Solved': return 'bg-green-100 text-green-600 border-green-200';
      case 'In Progress': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Under Review': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return 'text-gray-600 bg-gray-50';
    switch(priority) {
      case 'Urgent': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <FaClock className="text-gray-500" />;
    switch(status) {
      case 'Solved': return <FaCheck className="text-green-500" />;
      case 'Rejected': return <FaTimes className="text-red-500" />;
      case 'Pending': return <FaClock className="text-yellow-500" />;
      default: return <FaClock className="text-blue-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const getCitizenName = () => {
    if (!problem) return 'Unknown';
    if (problem.anonymous) return 'Anonymous';
    if (problem.citizen?.name) return problem.citizen.name;
    if (problem.citizenName) return problem.citizenName;
    return 'Unknown Citizen';
  };

  // ✅ Check if a URL is an image
  const isImageUrl = (url) => {
    if (!url) return false;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const ext = url.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(ext);
  };

  // ✅ Check if a URL is a video
  const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv'];
    const ext = url.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(ext);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="citizen" />
        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-[#FFCABE] mx-auto mb-4" />
            <p className="text-gray-500">Loading problem details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="citizen" />
        <div className="flex-1 p-8 ml-64 flex items-center justify-center">
          <div className="text-center">
            <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
            <p className="text-gray-500">{error || 'Problem not found'}</p>
            <button
              onClick={() => navigate('/citizen/dashboard')}
              className="mt-4 text-[#D4A09A] hover:text-[#8B5E5E] flex items-center gap-2 mx-auto"
            >
              <FaArrowLeft /> Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Separate images and videos from photos array
  const allMedia = problem.photos || [];
  const images = allMedia.filter(url => isImageUrl(url));
  const videos = allMedia.filter(url => isVideoUrl(url));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="citizen" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate('/citizen/dashboard')}
            className="text-gray-400 hover:text-[#D4A09A] transition-colors flex items-center gap-2 mb-4"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>

          {/* Main card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#FFF5F2] to-white">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-700">{problem.title || 'Untitled Problem'}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(problem.status)}`}>
                      {getStatusIcon(problem.status)}
                      {problem.status || 'Unknown'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(problem.priority)}`}>
                      {problem.priority || 'Medium'} Priority
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {problem.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaEye className="text-[#D4A09A]" />
                  <span>{problem.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Problem details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{problem.description || 'No description provided'}</p>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FaUser className="text-gray-400" />
                    <span className="text-gray-600">
                      Reported by: {getCitizenName()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendar className="text-gray-400" />
                    <span className="text-gray-600">
                      Reported on: {formatDate(problem.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {problem.location && (problem.location.lat || problem.location.lng || problem.location.address) && (
                    <div className="flex items-start gap-2 text-sm">
                      <FaMapMarkerAlt className="text-gray-400 mt-0.5" />
                      <div className="text-gray-600">
                        <div>{problem.location.address || 'Location'}</div>
                        {(problem.location.lat || problem.location.lng) && (
                          <div className="text-xs text-gray-400">
                            Lat: {problem.location.lat || 'N/A'}, Lng: {problem.location.lng || 'N/A'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {problem.assignedTo && (
                    <div className="flex items-center gap-2 text-sm">
                      <FaUser className="text-gray-400" />
                      <span className="text-gray-600">
                        Assigned to: {problem.assignedTo?.name || 'Not assigned'}
                      </span>
                    </div>
                  )}
                  {problem.assignedDepartment && (
                    <div className="flex items-center gap-2 text-sm">
                      <FaTag className="text-gray-400" />
                      <span className="text-gray-600">
                        Department: {problem.assignedDepartment}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ IMAGES DISPLAY */}
              {images && images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <FaImage className="text-[#D4A09A]" />
                    Images ({images.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((photo, index) => (
                      <div 
                        key={index} 
                        className="relative group rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => photo && setSelectedImage(photo)}
                      >
                        {photo ? (
                          <img 
                            src={photo} 
                            alt={`Problem image ${index + 1}`}
                            className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                            }}
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                            <FaImage className="text-gray-300 text-2xl" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                          <span>Image {index + 1}</span>
                          <FaExternalLinkAlt size={10} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ VIDEOS DISPLAY */}
              {videos && videos.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <FaVideo className="text-[#D4A09A]" />
                    Videos ({videos.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {videos.map((video, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <video 
                          controls 
                          className="w-full aspect-video bg-black"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        >
                          <source src={video} />
                          Your browser does not support the video tag.
                        </video>
                        <div className="p-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Video {index + 1}</span>
                          <a 
                            href={video} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-[#D4A09A] hover:text-[#8B5E5E] flex items-center gap-1"
                          >
                            <FaExternalLinkAlt size={10} /> Open
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {timeline && timeline.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <FaClock className="text-[#D4A09A]" />
                    Timeline
                  </h3>
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
                    {timeline.map((entry, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#FFCABE] border-2 border-white"></div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(entry.status)}`}>
                              {entry.status || 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(entry.timestamp || entry.createdAt)}
                            </span>
                          </div>
                          {entry.comment && (
                            <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            By: {entry.changedBy?.name || 'System'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#FFCABE] transition-colors"
            >
              <FaTimes size={24} />
            </button>
            <img 
              src={selectedImage} 
              alt="Full size"
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <a 
                href={selectedImage} 
                download 
                className="inline-flex items-center gap-2 text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <FaDownload /> Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemDetail;