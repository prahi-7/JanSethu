import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMicrophone, FaCamera, FaVideo, FaMapMarkerAlt, FaUpload,
  FaArrowLeft, FaArrowRight, FaCheck, FaTimes, FaFileAlt, FaLanguage,
  FaTrash, FaImage, FaFile, FaSpinner, FaSearch
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Sidebar from '../common/Sidebar';
import LocationPicker from '../map/LocationPicker';

const ReportProblem = () => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: { lat: '', lng: '', address: '' },
    photos: [],
    videos: [],
    priority: 'Medium',
    anonymous: false,
  });

  // ============================================================
  // FILE SIZE LIMITS
  // ============================================================
  // Images: maximum 20 MB per file
  // Videos: maximum 100 MB per file
  // ============================================================

  const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

  const categories = [
    'Roads',
    'Water',
    'Electricity',
    'Sanitation',
    'Healthcare',
    'Education',
    'Transport',
    'Housing',
    'Environment',
    'Other'
  ];

  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'ur-IN', name: 'Urdu' },
    { code: 'gu-IN', name: 'Gujarati' },
    { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' },
    { code: 'or-IN', name: 'Odia' },
    { code: 'pa-IN', name: 'Punjabi' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // ============================================================
  // STEP 1 VALIDATION
  // ============================================================

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // STEP 2 VALIDATION
  // ============================================================

  const validateStep2 = () => {
    const newErrors = {};

    const lat = parseFloat(formData.location.lat);
    const lng = parseFloat(formData.location.lng);

    if (!formData.location.lat || isNaN(lat)) {
      newErrors.location =
        'Please select a location by clicking on the map or search for an address';
    } else if (!formData.location.lng || isNaN(lng)) {
      newErrors.location =
        'Please select a location by clicking on the map or search for an address';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // VOICE INPUT
  // ============================================================

  const startVoiceRecording = () => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      toast.error('Voice recognition not supported. Please use Chrome.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = selectedLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      toast.success('🎤 Recording... Speak now!');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setFormData((prev) => ({
        ...prev,
        description: prev.description
          ? prev.description + ' ' + transcript
          : transcript,
      }));
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Voice recording failed. Please type instead.');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped!');
    }
  };

  // ============================================================
  // FILE HELPERS
  // ============================================================

  const getFileExtension = (filename) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const isImageFile = (file) => {
    const imageExtensions = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'webp',
      'bmp',
      'svg'
    ];

    const ext = getFileExtension(file.name);

    return imageExtensions.includes(ext);
  };

  const isVideoFile = (file) => {
    const videoExtensions = [
      'mp4',
      'mov',
      'avi',
      'webm',
      'mkv',
      'flv',
      'wmv',
      '3gp'
    ];

    const ext = getFileExtension(file.name);

    return videoExtensions.includes(ext);
  };

  // ============================================================
  // PHOTO UPLOAD
  // ============================================================

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);

    const imageFiles = files.filter((file) => isImageFile(file));
    const invalidFiles = files.filter((file) => !isImageFile(file));

    if (invalidFiles.length > 0) {
      toast.error(
        `${invalidFiles.length} file(s) skipped. Please upload JPG, JPEG, PNG, GIF, WEBP, or BMP.`
      );
    }

    if (imageFiles.length === 0) {
      e.target.value = '';
      return;
    }

    // Check image size
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (oversizedFiles.length > 0) {
      toast.error(
        `${oversizedFiles.length} image(s) exceed the 20 MB limit and were skipped.`
      );
    }

    const validFiles = imageFiles.filter(
      (file) => file.size <= MAX_IMAGE_SIZE
    );

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    const maxFiles = 5;
    const remaining = maxFiles - formData.photos.length;

    if (remaining <= 0) {
      toast.error('You can only upload 5 photos.');
      e.target.value = '';
      return;
    }

    if (validFiles.length > remaining) {
      toast.error(
        `Only ${remaining} more photo(s) can be added.`
      );

      const allowedFiles = validFiles.slice(0, remaining);

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...allowedFiles]
      }));

      toast.success(`${allowedFiles.length} photo(s) added!`);
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...validFiles]
    }));

    toast.success(`${validFiles.length} photo(s) added!`);

    e.target.value = '';
  };

  // ============================================================
  // VIDEO UPLOAD
  // ============================================================

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files || []);

    const videoFiles = files.filter((file) => isVideoFile(file));
    const invalidFiles = files.filter((file) => !isVideoFile(file));

    if (invalidFiles.length > 0) {
      toast.error(
        `${invalidFiles.length} file(s) skipped. Please upload MP4, MOV, AVI, WEBM, or MKV.`
      );
    }

    if (videoFiles.length === 0) {
      e.target.value = '';
      return;
    }

    // Check video size
    const oversizedFiles = videoFiles.filter(
      (file) => file.size > MAX_VIDEO_SIZE
    );

    if (oversizedFiles.length > 0) {
      toast.error(
        `${oversizedFiles.length} video(s) exceed the 100 MB limit and were skipped.`
      );
    }

    const validFiles = videoFiles.filter(
      (file) => file.size <= MAX_VIDEO_SIZE
    );

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    const maxFiles = 5;
    const remaining = maxFiles - formData.videos.length;

    if (remaining <= 0) {
      toast.error('You can only upload 5 videos.');
      e.target.value = '';
      return;
    }

    if (validFiles.length > remaining) {
      toast.error(
        `Only ${remaining} more video(s) can be added.`
      );

      const allowedFiles = validFiles.slice(0, remaining);

      setFormData((prev) => ({
        ...prev,
        videos: [...prev.videos, ...allowedFiles]
      }));

      toast.success(`${allowedFiles.length} video(s) added!`);
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, ...validFiles]
    }));

    toast.success(`${validFiles.length} video(s) added!`);

    e.target.value = '';
  };

  // ============================================================
  // REMOVE MEDIA
  // ============================================================

  const removeMedia = (index, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // ============================================================
  // SUBMIT PROBLEM
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateStep1() || !validateStep2()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    if (!formData.location.lat || !formData.location.lng) {
      toast.error('Please select a location on the map');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('jwt_token');

      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      const lat = parseFloat(formData.location.lat);
      const lng = parseFloat(formData.location.lng);

      if (isNaN(lat) || isNaN(lng)) {
        toast.error('Invalid location coordinates');
        return;
      }

      const locationData = {
        lat,
        lng,
        address:
          formData.location.address?.trim() ||
          `Lat: ${lat}, Lng: ${lng}`
      };

      // ========================================================
      // CREATE MULTIPART FORM DATA
      // ========================================================

      const requestBody = new FormData();

      requestBody.append('title', formData.title.trim());
      requestBody.append(
        'description',
        formData.description.trim()
      );
      requestBody.append('category', formData.category);
      requestBody.append(
        'priority',
        formData.priority || 'Medium'
      );
      requestBody.append(
        'anonymous',
        formData.anonymous ? 'true' : 'false'
      );

      requestBody.append(
        'location',
        JSON.stringify(locationData)
      );

      // ========================================================
      // ADD ACTUAL PHOTO FILES
      // ========================================================

      formData.photos.forEach((file) => {
        if (file instanceof File) {
          requestBody.append('photos', file);
        }
      });

      // ========================================================
      // ADD ACTUAL VIDEO FILES
      // ========================================================

      formData.videos.forEach((file) => {
        if (file instanceof File) {
          requestBody.append('videos', file);
        }
      });

      console.log('📤 Submitting problem with files:', {
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        photos: formData.photos.length,
        videos: formData.videos.length,
        location: locationData
      });

      // ========================================================
      // IMPORTANT:
      // DO NOT SET Content-Type.
      //
      // Browser automatically creates:
      // multipart/form-data; boundary=...
      // ========================================================

      const response = await fetch(
        'http://localhost:5000/api/problems',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: requestBody
        }
      );

      const data = await response.json();

      console.log('📥 Response:', data);

      if (data.success) {
        setUploadProgress(100);

        toast.success(
          '✅ Problem reported successfully!'
        );

        navigate('/citizen/dashboard');
      } else {
        const errorMsg = data.errors
          ? Array.isArray(data.errors)
            ? data.errors.join(', ')
            : data.errors
          : data.message || 'Failed to submit problem';

        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('❌ Submit error:', error);

      toast.error(
        'Failed to submit problem. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const goToNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // ============================================================
  // LOCATION DISPLAY
  // ============================================================

  const getLocationDisplay = () => {
    if (
      formData.location.address &&
      formData.location.address.trim() !== ''
    ) {
      return formData.location.address;
    }

    if (
      formData.location.lat &&
      formData.location.lng
    ) {
      return `📍 ${parseFloat(
        formData.location.lat
      ).toFixed(6)}, ${parseFloat(
        formData.location.lng
      ).toFixed(6)}`;
    }

    return 'Not provided';
  };

  // ============================================================
  // FILE DISPLAY HELPERS
  // ============================================================

  const getFileIcon = (file) => {
    if (typeof file === 'string') {
      if (
        file.match(
          /\.(jpg|jpeg|png|gif|webp|bmp)$/i
        )
      ) {
        return <FaImage className="text-blue-400" />;
      }

      if (
        file.match(
          /\.(mp4|mov|avi|webm|mkv)$/i
        )
      ) {
        return <FaVideo className="text-purple-400" />;
      }

      return <FaFile className="text-gray-400" />;
    }

    if (file.type?.startsWith('image/')) {
      return <FaImage className="text-blue-400" />;
    }

    if (file.type?.startsWith('video/')) {
      return <FaVideo className="text-purple-400" />;
    }

    return <FaFile className="text-gray-400" />;
  };

  const getFileName = (file) => {
    if (typeof file === 'string') {
      return file.split('/').pop() || file;
    }

    return file.name || 'File';
  };

  // ============================================================
  // LOCATION UPDATE
  // ============================================================

  const handleLocationUpdate = (location) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        lat: location.lat,
        lng: location.lng,
        address:
          location.address ||
          prev.location.address ||
          ''
      }
    }));

    if (errors.location) {
      setErrors({
        ...errors,
        location: ''
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <div className="hidden md:block">
        <Sidebar role="citizen" />
      </div>

      <div className="flex-1 p-3 sm:p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-4xl mx-auto">

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-4 md:mb-6">
            Report a Problem
          </h1>

          {/* STEP INDICATOR */}
          <div className="flex items-center justify-between mb-6 md:mb-8 px-1 sm:px-2">

            {['Describe', 'Location', 'Submit'].map(
              (label, index) => (
                <div
                  key={index}
                  className="flex items-center"
                >

                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base ${
                      step > index + 1
                        ? 'bg-green-400 text-white'
                        : step === index + 1
                        ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-[#FFCABE]'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > index + 1 ? (
                      <FaCheck />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <span
                    className={`ml-1 sm:ml-2 text-[10px] sm:text-xs md:text-sm ${
                      step === index + 1
                        ? 'text-[#FFCABE] font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>

                  {index < 2 && (
                    <div className="w-4 sm:w-8 md:w-16 h-0.5 bg-gray-200 mx-1 sm:mx-2"></div>
                  )}

                </div>
              )
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8"
          >

            {/* ==================================================
                STEP 1
            ================================================== */}

            {step === 1 && (
              <div className="space-y-4 sm:space-y-5">

                {/* LANGUAGE */}

                <div>

                  <label className="text-sm font-semibold text-gray-600 mb-1.5 sm:mb-2 flex items-center gap-2">
                    <FaLanguage className="text-pink-400" />
                    Select Language
                  </label>

                  <select
                    value={selectedLanguage}
                    onChange={(e) =>
                      setSelectedLanguage(e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm sm:text-base"
                  >

                    {languages.map((lang) => (
                      <option
                        key={lang.code}
                        value={lang.code}
                      >
                        {lang.name}
                      </option>
                    ))}

                  </select>

                </div>

                {/* TITLE */}

                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Problem Title{' '}
                    <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Water pipeline burst in Main Road"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm sm:text-base ${
                      errors.title
                        ? 'border-red-400'
                        : 'border-gray-200'
                    }`}
                  />

                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.title}
                    </p>
                  )}

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Description{' '}
                    <span className="text-red-400">*</span>
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe the problem in detail..."
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm sm:text-base ${
                      errors.description
                        ? 'border-red-400'
                        : 'border-gray-200'
                    }`}
                  />

                  {errors.description && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">

                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FFF5F2] text-[#D4A09A] rounded-lg hover:bg-pink-100 transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                      >
                        <FaMicrophone />
                        Record Voice
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 sm:gap-2 text-sm animate-pulse"
                      >
                        <FaMicrophone />
                        Recording...
                      </button>
                    )}

                    <span className="text-xs text-gray-400 self-center">
                      {languages.find(
                        (l) =>
                          l.code === selectedLanguage
                      )?.name || 'English'}
                    </span>

                  </div>

                </div>

                {/* CATEGORY + PRIORITY */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                  <div>

                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Category{' '}
                      <span className="text-red-400">*</span>
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm sm:text-base ${
                        errors.category
                          ? 'border-red-400'
                          : 'border-gray-200'
                      }`}
                    >

                      <option value="">
                        Select Category
                      </option>

                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}

                    </select>

                    {errors.category && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.category}
                      </p>
                    )}

                  </div>

                  <div>

                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm sm:text-base"
                    >

                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>

                    </select>

                  </div>

                </div>

                {/* FILE UPLOAD */}

                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Upload Media (Max 5 photos & 5 videos)
                  </label>

                  <p className="text-xs text-gray-400 mb-2">
                    Photos: JPG, JPEG, PNG, GIF, WEBP, BMP
                    (Max 20 MB each) | Videos: MP4, MOV, AVI,
                    WEBM, MKV (Max 100 MB each)
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3">

                    {/* PHOTOS */}

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="px-3 sm:px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 transition-colors text-gray-600 flex items-center gap-1 sm:gap-2 text-sm hover:bg-[#FFF5F2]/50"
                    >
                      <FaCamera />
                      Add Photos ({formData.photos.length}/5)
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {/* VIDEOS */}

                    <button
                      type="button"
                      onClick={() =>
                        videoInputRef.current?.click()
                      }
                      className="px-3 sm:px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 transition-colors text-gray-600 flex items-center gap-1 sm:gap-2 text-sm hover:bg-[#FFF5F2]/50"
                    >
                      <FaVideo />
                      Add Videos ({formData.videos.length}/5)
                    </button>

                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                      multiple
                      onChange={handleVideoUpload}
                      className="hidden"
                    />

                  </div>

                  {/* PHOTOS PREVIEW */}

                  {formData.photos.length > 0 && (
                    <div className="mt-3">

                      <p className="text-sm text-gray-500 mb-2">
                        📷 Photos ({formData.photos.length}):
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {formData.photos.map(
                          (photo, index) => (
                            <div
                              key={index}
                              className="relative group"
                            >

                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                <FaImage className="text-blue-400 text-xl" />
                              </div>

                              <span className="absolute bottom-0 left-0 right-0 text-[8px] bg-black/50 text-white text-center truncate px-1">
                                {photo.name
                                  ? `${photo.name.substring(
                                      0,
                                      10
                                    )}...`
                                  : getFileName(photo)}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeMedia(
                                    index,
                                    'photos'
                                  )
                                }
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTimes size={12} />
                              </button>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                  {/* VIDEOS PREVIEW */}

                  {formData.videos.length > 0 && (
                    <div className="mt-3">

                      <p className="text-sm text-gray-500 mb-2">
                        🎥 Videos ({formData.videos.length}):
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {formData.videos.map(
                          (video, index) => (
                            <div
                              key={index}
                              className="relative group bg-gray-100 rounded-lg p-2 border border-gray-200 flex items-center gap-2"
                            >

                              <FaVideo className="text-purple-400" />

                              <span className="text-xs text-gray-600 truncate max-w-[80px]">
                                {video.name ||
                                  getFileName(video)}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeMedia(
                                    index,
                                    'videos'
                                  )
                                }
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTimes size={12} />
                              </button>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                </div>

                {/* ANONYMOUS */}

                <div className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#FFCABE] border-gray-300 rounded focus:ring-pink-400"
                  />

                  <label className="text-sm text-gray-500">
                    Submit anonymously
                  </label>

                </div>

                {/* NEXT */}

                <button
                  type="button"
                  onClick={goToNextStep}
                  className="w-full bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] text-sm sm:text-base"
                >
                  Next: Location
                  <FaArrowRight />
                </button>

              </div>
            )}

            {/* ==================================================
                STEP 2
            ================================================== */}

            {step === 2 && (
              <div className="space-y-4 sm:space-y-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Problem Location{' '}
                    <span className="text-red-400">*</span>
                  </label>

                  <LocationPicker
                    initialLocation={
                      formData.location.lat &&
                      formData.location.lng
                        ? {
                            lat: parseFloat(
                              formData.location.lat
                            ),
                            lng: parseFloat(
                              formData.location.lng
                            ),
                            address:
                              formData.location.address ||
                              ''
                          }
                        : {
                            lat: 28.6139,
                            lng: 77.2090,
                            address: ''
                          }
                    }
                    onLocationSelect={handleLocationUpdate}
                    height="400px"
                    showSearch={true}
                  />

                  {errors.location && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.location}
                    </p>
                  )}

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Address (Auto-filled from map)
                  </label>

                  <input
                    type="text"
                    value={
                      formData.location.address || ''
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          address: e.target.value
                        }
                      })
                    }
                    placeholder="Address will appear here when you select a location"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm"
                    readOnly
                  />

                </div>

                {formData.location.lat &&
                  formData.location.lng && (
                    <div className="bg-blue-50 rounded-lg p-2 text-xs text-gray-600">
                      📍 Selected Location:{' '}
                      {parseFloat(
                        formData.location.lat
                      ).toFixed(6)}
                      ,{' '}
                      {parseFloat(
                        formData.location.lng
                      ).toFixed(6)}
                    </div>
                  )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaArrowLeft />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="flex-1 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] text-sm"
                  >
                    Next: Submit
                    <FaArrowRight />
                  </button>

                </div>

              </div>
            )}

            {/* ==================================================
                STEP 3
            ================================================== */}

            {step === 3 && (
              <div className="space-y-4 sm:space-y-5">

                <div className="bg-[#FFF5F2]/50 rounded-xl p-4 sm:p-6 border border-pink-100">

                  <h3 className="font-semibold text-[#D4A09A] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <FaFileAlt />
                    Review Your Problem
                  </h3>

                  <div className="space-y-1 sm:space-y-2 text-sm text-gray-600">

                    <p>
                      <span className="text-gray-400">
                        Title:
                      </span>{' '}
                      {formData.title}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Category:
                      </span>{' '}
                      {formData.category}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Priority:
                      </span>{' '}
                      {formData.priority}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Location:
                      </span>{' '}
                      {getLocationDisplay()}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Photos:
                      </span>{' '}
                      {formData.photos.length}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Videos:
                      </span>{' '}
                      {formData.videos.length}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Anonymous:
                      </span>{' '}
                      {formData.anonymous
                        ? 'Yes'
                        : 'No'}
                    </p>

                  </div>

                </div>

                {/* UPLOAD PROGRESS */}

                {isSubmitting && (
                  <div className="bg-blue-50 rounded-xl p-3">

                    <div className="flex items-center justify-between mb-1">

                      <span className="text-xs text-gray-600">
                        Uploading...
                      </span>

                      <span className="text-xs text-gray-600">
                        {uploadProgress}%
                      </span>

                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-400 transition-all duration-300"
                        style={{
                          width: `${uploadProgress}%`
                        }}
                      />

                    </div>

                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaArrowLeft />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg shadow-green-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:scale-[1.02] text-sm"
                  >

                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Submit Problem
                      </>
                    )}

                  </button>

                </div>

              </div>
            )}

          </form>

        </div>

      </div>

    </div>
  );
};

export default ReportProblem;