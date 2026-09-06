import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaPaperPlane, 
  FaUser,
  FaUsers,
  FaClock,
  FaImage,
  FaSmile,
  FaVideo,
  FaFile,
  FaHeart
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import toast from 'react-hot-toast';

const TeamChat = () => {
  const { teamId } = useParams();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Anu', message: 'Hi team! How are we doing?', time: '10:30 AM', isMine: false },
    { id: 2, sender: 'You', message: 'Great! Let\'s get started.', time: '10:32 AM', isMine: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [teamInfo] = useState({
    name: 'Environmental Warriors',
    members: ['Anu', 'Rahul', 'Priya', 'You'],
    online: ['Anu', 'Rahul'],
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now(),
      sender: 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };
    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent! 💬');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Sidebar role="student" />
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-t-2xl border border-gray-100 border-b-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/student/teams" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FaArrowLeft />
                </Link>
                <div>
                  <h2 className="text-lg font-bold text-gray-700">{teamInfo.name}</h2>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <FaUsers /> {teamInfo.members.length} members
                    <span className="text-xs text-green-400">• {teamInfo.online.length} online</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaClock className="text-pink-400" /> Project: Water Quality
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-b-2xl h-[450px] md:h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${msg.isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!msg.isMine && <p className="text-xs text-gray-500 font-medium mb-1">{msg.sender}</p>}
                    <div className={`rounded-2xl p-3 ${msg.isMine ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className={`text-xs text-gray-400 mt-1 ${msg.isMine ? 'text-right' : ''}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-2 bg-[#FFF5F2]/50 border-t border-gray-100 flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Online:</span>
              {teamInfo.online.map((member, idx) => (
                <span key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span> {member}
                  {idx < teamInfo.online.length - 1 && ','}
                </span>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-4 bg-white/80 rounded-b-2xl">
              <div className="flex gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-pink-400 transition-colors"><FaImage /></button>
                <button type="button" className="p-2 text-gray-400 hover:text-pink-400 transition-colors"><FaVideo /></button>
                <button type="button" className="p-2 text-gray-400 hover:text-pink-400 transition-colors"><FaFile /></button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;