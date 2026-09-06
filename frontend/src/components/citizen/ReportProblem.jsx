import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMicrophone, 
  FaCamera, 
  FaVideo, 
  FaMapMarkerAlt, 
  FaUpload,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaLanguage
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Sidebar from '../common/Sidebar';

const ReportProblem = () => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
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
    priority: 'medium',
    anonymous: false,
  });

  const categories = [
    'Water & Sanitation', 'Roads & Infrastructure', 'Electricity & Power',
    'Education', 'Healthcare', 'Waste Management', 'Agriculture',
    'Environment', 'Digital Services', 'Public Safety', 'Housing & Shelter', 'Other'
  ];

  const languages = [
    { code: 'en-US', name: 'English' }, { code: 'hi-IN', name: 'Hindi' },
    { code: 'bn-IN', name: 'Bengali' }, { code: 'te-IN', name: 'Telugu' },
    { code: 'ta-IN', name: 'Tamil' }, { code: 'mr-IN', name: 'Marathi' },
    { code: 'ur-IN', name: 'Urdu' }, { code: 'gu-IN', name: 'Gujarati' },
    { code: 'kn-IN', name: 'Kannada' }, { code: 'ml-IN', name: 'Malayalam' },
    { code: 'or-IN', name: 'Odia' }, { code: 'pa-IN', name: 'Punjabi' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition not supported. Please use Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      toast.success('🎤 Recording... Speak now!');
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData((prev) => ({
        ...prev,
        description: prev.description ? prev.description + ' ' + transcript : transcript,
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

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => 
      type === 'photo' ? file.type.startsWith('image/') : file.type.startsWith('video/')
    );
    setFormData((prev) => ({
      ...prev,
      [type === 'photo' ? 'photos' : 'videos']: [
        ...prev[type === 'photo' ? 'photos' : 'videos'],
        ...validFiles
      ],
    }));
    toast.success(`${validFiles.length} ${type}(s) added!`);
  };

  const removeMedia = (index, type) => {
    setFormData((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: { lat: position.coords.latitude, lng: position.coords.longitude, address: 'Current Location' }
          }));
          toast.success('📍 Location captured!');
        },
        () => toast.error('Failed to get location. Please enter manually.')
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('✅ Problem reported successfully!');
      navigate('/citizen/dashboard');
    } catch (error) {
      toast.error('Failed to submit problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <div className="hidden md:block"><Sidebar role="citizen" /></div>
      <div className="flex-1 p-3 sm:p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-4 md:mb-6">Report a Problem</h1>
          
          <div className="flex items-center justify-between mb-6 md:mb-8 px-1 sm:px-2">
            {['Describe', 'Location', 'Submit'].map((label, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base ${
                  step > index + 1 ? 'bg-green-400 text-white' :
                  step === index + 1 ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-[#FFCABE]' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step > index + 1 ? <FaCheck /> : index + 1}
                </div>
                <span className={`ml-1 sm:ml-2 text-[10px] sm:text-xs md:text-sm ${
                  step === index + 1 ? 'text-[#FFCABE] font-semibold' : 'text-gray-400'
                }`}>
                  {label}
                </span>
                {index < 2 && <div className="w-4 sm:w-8 md:w-16 h-0.5 bg-gray-200 mx-1 sm:mx-2"></div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1.5 sm:mb-2 flex items-center gap-2">
                    <FaLanguage className="text-pink-400" /> Select Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm sm:text-base"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Problem Title <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Water pipeline burst in Main Road"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Description <span className="text-red-400">*</span></label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3 sm:rows-4"
                    placeholder="Describe the problem in detail..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                    required
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FFF5F2] text-[#D4A09A] rounded-lg hover:bg-pink-100 transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                      >
                        <FaMicrophone /> Record Voice
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 sm:gap-2 text-sm animate-pulse"
                      >
                        <FaMicrophone /> Recording...
                      </button>
                    )}
                    <span className="text-xs text-gray-400 self-center">
                      {languages.find(l => l.code === selectedLanguage)?.name || 'English'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Category <span className="text-red-400">*</span></label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm sm:text-base"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm sm:text-base"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Upload Media</label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-3 sm:px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 transition-colors text-gray-600 flex items-center gap-1 sm:gap-2 text-sm hover:bg-[#FFF5F2]/50"
                    >
                      <FaCamera /> Add Photos
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'photos')} className="hidden" />
                    <button
                      type="button"
                      onClick={() => videoInputRef.current.click()}
                      className="px-3 sm:px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 transition-colors text-gray-600 flex items-center gap-1 sm:gap-2 text-sm hover:bg-[#FFF5F2]/50"
                    >
                      <FaVideo /> Add Videos
                    </button>
                    <input ref={videoInputRef} type="file" accept="video/*" multiple onChange={(e) => handleFileUpload(e, 'videos')} className="hidden" />
                  </div>
                  {formData.photos.length > 0 && <p className="text-sm text-gray-400 mt-2">📷 {formData.photos.length} photos selected</p>}
                  {formData.videos.length > 0 && <p className="text-sm text-gray-400 mt-1">🎥 {formData.videos.length} videos selected</p>}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#FFCABE] border-gray-300 rounded focus:ring-pink-400"
                  />
                  <label className="text-sm text-gray-500">Submit anonymously</label>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] text-sm sm:text-base"
                >
                  Next: Location <FaArrowRight />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Problem Location <span className="text-red-400">*</span></label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                  >
                    <FaMapMarkerAlt /> Use Current Location
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={formData.location.lat || ''}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, lat: e.target.value } })}
                      placeholder="23.3441"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={formData.location.lng || ''}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, lng: e.target.value } })}
                      placeholder="85.3094"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.location.address || ''}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                    placeholder="e.g., Main Road, Bokaro, Jharkhand"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400 text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg shadow-[#FFCABE] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] text-sm"
                  >
                    Next: Submit <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="bg-[#FFF5F2]/50 rounded-xl p-4 sm:p-6 border border-pink-100">
                  <h3 className="font-semibold text-[#D4A09A] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <FaFileAlt /> Review Your Problem
                  </h3>
                  <div className="space-y-1 sm:space-y-2 text-sm text-gray-600">
                    <p><span className="text-gray-400">Title:</span> {formData.title}</p>
                    <p><span className="text-gray-400">Category:</span> {formData.category}</p>
                    <p><span className="text-gray-400">Priority:</span> {formData.priority}</p>
                    <p><span className="text-gray-400">Location:</span> {formData.location.address || 'Not provided'}</p>
                    <p><span className="text-gray-400">Photos:</span> {formData.photos.length}</p>
                    <p><span className="text-gray-400">Videos:</span> {formData.videos.length}</p>
                    <p><span className="text-gray-400">Anonymous:</span> {formData.anonymous ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg shadow-green-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:scale-[1.02] text-sm"
                  >
                    <FaUpload />
                    {isSubmitting ? 'Submitting...' : 'Submit Problem'}
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